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
 *
 * IMPORTANT: refresh is driven by USER ACTIVITY (throttled) and by the tab
 * becoming visible again — NOT only by a background timer. Browsers heavily
 * throttle setInterval/setTimeout in backgrounded tabs (and pause them when the
 * machine sleeps), so a timer-only approach silently fails and the user gets
 * logged out. Tying refresh to activity/visibility keeps an active session
 * alive reliably.
 */
@Injectable({ providedIn: 'root' })
export class IdleTimeoutService implements OnDestroy {

    /** Inactivity window before auto logout (30 minutes). */
    private readonly IDLE_LIMIT_MS = 30 * 60 * 1000;

    /** Refresh once the token has this little life left. The JWT lives 30 min,
     *  so refreshing at 15 min remaining keeps a wide safety margin and works
     *  even right after a page reload (driven by the token's real expiry). */
    private readonly REFRESH_AHEAD_MS = 15 * 60 * 1000;

    /** Backstop poll so refresh still happens even with little pointer movement. */
    private readonly POLL_MS = 60 * 1000;

    /** Activity timestamp is shared across tabs via localStorage. */
    private readonly LAST_ACTIVITY_KEY = 'lastActivityAt';

    private readonly activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    private timerId: any = null;
    private pollId: any = null;
    private started = false;
    private refreshing = false;
    private boundActivity = () => this.onActivity();
    private boundStorage = (e: StorageEvent) => this.onStorage(e);
    private boundVisibility = () => this.onVisibility();

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
            document.addEventListener('visibilitychange', this.boundVisibility);
            this.scheduleCheck();
            this.schedulePoll();
        });
    }

    /** Stop watching (e.g. on logout). */
    stop(): void {
        this.started = false;
        this.activityEvents.forEach(ev => window.removeEventListener(ev, this.boundActivity));
        window.removeEventListener('storage', this.boundStorage);
        document.removeEventListener('visibilitychange', this.boundVisibility);
        if (this.pollId) { clearInterval(this.pollId); this.pollId = null; }
        if (this.timerId) { clearTimeout(this.timerId); this.timerId = null; }
    }

    ngOnDestroy(): void {
        this.stop();
    }

    private onActivity(): void {
        this.markActivity();
        // Keep the session alive while the user works (throttled internally).
        this.maybeRefresh();
    }

    /** Another tab updated the activity time — keep this tab in sync. */
    private onStorage(e: StorageEvent): void {
        if (e.key === this.LAST_ACTIVITY_KEY) {
            // nothing to do; the next scheduled check reads the fresh value
        }
    }

    /** Tab came back to the foreground — timers may have been throttled while
     *  hidden, so refresh now if the user is still within the active window. */
    private onVisibility(): void {
        if (document.visibilityState === 'visible') {
            this.markActivity();
            this.maybeRefresh();
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

    /** Backstop poll: keep the token fresh even if the user isn't moving much. */
    private schedulePoll(): void {
        if (this.pollId) clearInterval(this.pollId);
        this.pollId = setInterval(() => this.maybeRefresh(), this.POLL_MS);
    }

    /** Milliseconds until the current JWT expires (null if no/invalid token). */
    private tokenRemainingMs(): number | null {
        const decoded = this.api.getDecodedToken();
        if (!decoded?.exp) return null;
        return decoded.exp * 1000 - Date.now();
    }

    /** Refresh the token if the user is still active and the token is getting
     *  close to expiry. Driven by the token's REAL expiry, so it works after a
     *  reload too. Cheap to call on every activity event. */
    private maybeRefresh(): void {
        if (this.refreshing) return;
        if (Date.now() - this.lastActivity() >= this.IDLE_LIMIT_MS) return;  // idle — let it lapse
        const remaining = this.tokenRemainingMs();
        if (remaining === null) return;                       // not logged in / bad token
        if (remaining > this.REFRESH_AHEAD_MS) return;        // still plenty of life — wait
        this.refreshing = true;
        this.refreshToken();
    }

    private refreshToken(): void {
        this.api.post('refresh-token', {}).subscribe({
            next: (res: any) => {
                this.refreshing = false;
                const newToken = res?.token || res?.data?.token;
                if (newToken) {
                    this.api.setToken(newToken);
                } else {
                    // Interceptor turns errors into 200s, so a missing token means
                    // the refresh was rejected; next poll/activity will retry.
                    console.warn('token refresh returned no token:', res);
                }
            },
            error: (err: any) => {
                this.refreshing = false;
                console.error('token refresh failed:', err);
            },
        });
    }
}
