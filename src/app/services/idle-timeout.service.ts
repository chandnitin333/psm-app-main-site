import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';

/**
 * Activity-based auto logout WITH token keep-alive.
 *
 * The JWT itself is short (30 min). While the user is active, this service
 * refreshes the token before it expires, so an actively-working user is never
 * logged out mid-task. After 30 minutes of continuous inactivity the refresh
 * stops and the user is logged out.
 */
@Injectable({ providedIn: 'root' })
export class IdleTimeoutService implements OnDestroy {

    /** Inactivity window before auto logout (30 minutes). */
    private readonly IDLE_LIMIT_MS = 30 * 60 * 1000;

    /** How often to refresh the token while active (well under the 30-min token life). */
    private readonly REFRESH_INTERVAL_MS = 10 * 60 * 1000;

    /** Activity timestamp is shared across tabs via localStorage. */
    private readonly LAST_ACTIVITY_KEY = 'lastActivityAt';

    private readonly activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    private timerId: any = null;
    private refreshId: any = null;
    private started = false;
    private boundActivity = () => this.onActivity();
    private boundStorage = (e: StorageEvent) => this.onStorage(e);

    constructor(private auth: AuthService, private zone: NgZone, private api: ApiService) { }

    /** Begin watching for inactivity. Safe to call multiple times. */
    start(): void {
        if (this.started) return;
        this.started = true;
        this.markActivity();
        // Register listeners outside Angular so constant mousemove doesn't
        // trigger change detection on every pixel.
        this.zone.runOutsideAngular(() => {
            this.activityEvents.forEach(ev =>
                window.addEventListener(ev, this.boundActivity, { passive: true }));
            window.addEventListener('storage', this.boundStorage);
            this.scheduleCheck();
            this.scheduleRefresh();
        });
    }

    /** Stop watching (e.g. on logout). */
    stop(): void {
        this.started = false;
        this.activityEvents.forEach(ev => window.removeEventListener(ev, this.boundActivity));
        window.removeEventListener('storage', this.boundStorage);
        if (this.refreshId) { clearInterval(this.refreshId); this.refreshId = null; }
        if (this.timerId) { clearTimeout(this.timerId); this.timerId = null; }
    }

    ngOnDestroy(): void {
        this.stop();
    }

    private onActivity(): void {
        this.markActivity();
    }

    /** Another tab updated the activity time — keep this tab in sync. */
    private onStorage(e: StorageEvent): void {
        if (e.key === this.LAST_ACTIVITY_KEY) {
            // nothing to do; the next scheduled check reads the fresh value
        }
    }

    private markActivity(): void {
        try {
            localStorage.setItem(this.LAST_ACTIVITY_KEY, String(Date.now()));
        } catch { /* ignore quota errors */ }
    }

    private lastActivity(): number {
        const v = Number(localStorage.getItem(this.LAST_ACTIVITY_KEY));
        return Number.isFinite(v) && v > 0 ? v : Date.now();
    }

    /** Re-check every 30s; logout once idle exceeds the limit. */
    private scheduleCheck(): void {
        if (this.timerId) clearTimeout(this.timerId);
        this.timerId = setTimeout(() => {
            const idleFor = Date.now() - this.lastActivity();
            if (idleFor >= this.IDLE_LIMIT_MS) {
                this.zone.run(() => {
                    this.stop();
                    this.auth.logout();
                });
                return;
            }
            this.scheduleCheck();
        }, 30 * 1000);
    }

    /** While active, refresh the token before the 30-min JWT expires. */
    private scheduleRefresh(): void {
        if (this.refreshId) clearInterval(this.refreshId);
        this.refreshId = setInterval(() => {
            const idleFor = Date.now() - this.lastActivity();
            // Only keep the session alive if the user was active recently.
            if (idleFor < this.IDLE_LIMIT_MS) {
                this.refreshToken();
            }
        }, this.REFRESH_INTERVAL_MS);
    }

    private refreshToken(): void {
        this.api.post('refresh-token', {}).subscribe({
            next: (res: any) => {
                const newToken = res?.token || res?.data?.token;
                if (newToken) {
                    this.api.setToken(newToken);
                }
            },
            error: (err: any) => console.error('token refresh failed:', err),
        });
    }
}
