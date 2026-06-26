import posthog from 'posthog-js';

const key = import.meta.env.VITE_POSTHOG_KEY;
const host = import.meta.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com';

/**
 * Initializes PostHog with GDPR-compliant defaults:
 * - Tracking is disabled by default (opt_out_capturing_by_default: true).
 * - Autocapture is disabled to ensure we only collect high-signal, explicitly consented data.
 */
export function initPostHog() {
    if (!key) {
        console.warn("PostHog Analytics key is missing. Tracking will remain disabled.");
        return;
    }

    try {
        posthog.init(key, {
            api_host: host,
            opt_out_capturing_by_default: true,
            persistence: 'localStorage',
            capture_pageview: false, // We will track views manually
            autocapture: false,      // High-signal manual event tracking only
            api_transport: 'fetch',
        });
        console.log("PostHog Analytics: Initialized successfully (opt-out by default).");
    } catch (err) {
        console.error("PostHog Analytics failed to initialize:", err);
    }
}

/**
 * Opt the user in to analytics tracking.
 */
export function optInTracking() {
    if (!key) return;
    try {
        posthog.opt_in_capturing();
        console.log("PostHog Analytics: Tracking opted IN.");
    } catch (err) {
        console.error("PostHog Analytics: Failed to opt-in:", err);
    }
}

/**
 * Opt the user out of analytics tracking.
 */
export function optOutTracking() {
    if (!key) return;
    try {
        posthog.opt_out_capturing();
        console.log("PostHog Analytics: Tracking opted OUT.");
    } catch (err) {
        console.error("PostHog Analytics: Failed to opt-out:", err);
    }
}

/**
 * Track a pageview / view state change.
 */
export function trackPageView(viewName: string) {
    if (!key) return;
    try {
        posthog.capture('$pageview', {
            $current_url: window.location.href,
            view: viewName,
        });
    } catch (err) {
        console.error("PostHog Analytics: Failed to track page view:", err);
    }
}

/**
 * Track a custom event.
 */
export function trackEvent(name: string, properties?: Record<string, unknown>) {
    if (!key) return;
    try {
        posthog.capture(name, properties);
    } catch (err) {
        console.error(`PostHog Analytics: Failed to track event [${name}]:`, err);
    }
}

/**
 * Identify user with details from database.
 */
export function identifyUser(userId: string, traits?: Record<string, unknown>) {
    if (!key) return;
    try {
        posthog.identify(userId, traits);
    } catch (err) {
        console.error("PostHog Analytics: Failed to identify user:", err);
    }
}

/**
 * Reset user identity (on logout).
 */
export function resetUser() {
    if (!key) return;
    try {
        posthog.reset();
        console.log("PostHog Analytics: User identity reset.");
    } catch (err) {
        console.error("PostHog Analytics: Failed to reset user:", err);
    }
}
