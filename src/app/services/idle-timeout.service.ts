import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * Activity-based auto logout.
 *
 * The user is logged out ONLY after a continuous period of inactivity
 * (no mouse / keyboard / touch / scroll). Any interaction resets the timer,
 * so an actively-working user is never logged out mid-task.
 *
 * This is independent of the JWT expiry — the token can stay long-lived; this
 * service governs the "idle" session lifetime.
 */
@Injectable({ providedIn: 'root' })
export class IdleTimeoutService implements OnDestroy {

    /** Inactivity window before auto logout (30 minutes). */
    private readonly IDLE_LIMIT_MS = 30 * 60 * 1000;

    /** Activity timestamp is shared across tabs via localStorage. */
    private readonly LAST_ACTIVITY_KEY = 'lastActivityAt';

    private readonly activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    private timerId: any = null;
    private started = false;
    private boundActivity = () => this.onActivity();
    private boundStorage = (e: StorageEvent) => this.onStorage(e);

    constructor(private auth: AuthService, private zone: NgZone) { }

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
        });
    }

    /** Stop watching (e.g. on logout). */
    stop(): void {
        this.started = false;
        this.activityEvents.forEach(ev => window.removeEventListener(ev, this.boundActivity));
        window.removeEventListener('storage', this.boundStorage);
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
}
