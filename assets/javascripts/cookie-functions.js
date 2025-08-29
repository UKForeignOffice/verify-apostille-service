(function (root) {
    'use strict';

    // Ensure namespace
    window.GOVUK = window.GOVUK || {};

    // ---- Configuration -------------------------------------------------------

    var DEFAULT_COOKIE_CONSENT = {
        essential: true,
        settings:  false,
        usage:     false,
        campaigns: false
    };

    // Map known cookies to categories
    var COOKIE_CATEGORIES = {
        // Essential
        'cookies_policy':            'essential',
        'cookies_preferences_set':   'essential',
        'seen_cookie_message':       'essential',
        '_email-alert-frontend_session': 'essential',
        'licensing_session':         'essential',
        'govuk_contact_referrer':    'essential',

        // Settings
        'dgu_beta_banner_dismissed':     'settings',
        'global_bar_seen':               'settings',
        'govuk_browser_upgrade_dismisssed': 'settings',
        'govuk_not_first_visit':         'settings',

        // Usage / analytics (Matomo + GA legacy)
        'analytics_next_page_call': 'usage',
        '_ga':  'usage',
        '_gid': 'usage',
        '_gat': 'usage',
        'JS-Detection': 'usage',
        'TLSversion':   'usage',
        '_pk_ref':  'usage',
        '_pk_cvr':  'usage',
        '_pk_id':   'usage',
        '_pk_ses':  'usage'
    };

    // ---- Low-level cookie helpers -------------------------------------------

    // Generic getter/setter/deleter
    window.GOVUK.cookie = function (name, value, options) {
        if (typeof value !== 'undefined') {
            if (value === false || value === null) {
                return window.GOVUK.setCookie(name, '', { days: -1 });
            } else {
                if (typeof options === 'undefined') options = { days: 30 };
                return window.GOVUK.setCookie(name, value, options);
            }
        } else {
            return window.GOVUK.getCookie(name);
        }
    };

    window.GOVUK.setCookie = function (name, value, options) {
        if (!window.GOVUK.checkConsentCookie(name, value)) return;

        if (typeof options === 'undefined') options = {};
        var cookieString = name + '=' + encodeURIComponent(value) + '; path=/';

        if (options.days) {
            var date = new Date();
            date.setTime(date.getTime() + (options.days * 24 * 60 * 60 * 1000));
            cookieString += '; expires=' + date.toUTCString();
        }

        if (document.location.protocol === 'https:') cookieString += '; Secure';
        // Be explicit to avoid third-party contexts
        cookieString += '; SameSite=Lax';

        document.cookie = cookieString;
    };

    window.GOVUK.getCookie = function (name) {
        var nameEQ = name + '=';
        var cookies = document.cookie ? document.cookie.split(';') : [];
        for (var i = 0; i < cookies.length; i++) {
            var c = cookies[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
        }
        return null;
    };

    window.GOVUK.deleteCookie = function (cookie) {
        // Try via helper first
        window.GOVUK.cookie(cookie, null);

        // Belt-and-braces: delete raw + domain variant
        if (window.GOVUK.cookie(cookie)) {
            var base = cookie + '=; expires=' + new Date(0).toUTCString() + '; path=/';
            document.cookie = base;
            document.cookie = base + '; domain=' + window.location.hostname;
        }
    };

    window.GOVUK.getCookieCategory = function (cookieName) {
        return COOKIE_CATEGORIES[cookieName];
    };

    // ---- Consent handling ----------------------------------------------------

    window.GOVUK.getConsentCookie = function () {
        var raw = window.GOVUK.cookie('cookies_policy');
        if (!raw) return null;

        try {
            var parsed = JSON.parse(raw);
            return (parsed && typeof parsed === 'object') ? parsed : null;
        } catch (e) {
            return null;
        }
    };

    window.GOVUK.setConsentCookie = function (options) {
        var current = window.GOVUK.getConsentCookie();
        if (!current) current = JSON.parse(JSON.stringify(DEFAULT_COOKIE_CONSENT));

        // Apply incoming changes
        for (var type in options) {
            if (Object.prototype.hasOwnProperty.call(options, type)) {
                current[type] = options[type];

                // If turning a category OFF, delete all cookies of that category
                if (options[type] === false) {
                    for (var cookieName in COOKIE_CATEGORIES) {
                        if (COOKIE_CATEGORIES[cookieName] === type) {
                            window.GOVUK.deleteCookie(cookieName);
                        }
                    }
                }
            }
        }

        // Persist consent for 1 year
        window.GOVUK.setCookie('cookies_policy', JSON.stringify(current), { days: 365 });

        // Apply analytics mode immediately
        window.GOVUK.applyAnalyticsPreference(current);
    };

    // Allow/deny setting a cookie based on consent and our known map
    window.GOVUK.checkConsentCookie = function (cookieName, cookieValue) {
        // Always allow writing/overwriting the consent cookie itself,
        // and allow deletions (value null/false) for any cookie.
        if (cookieName === 'cookies_policy' || cookieName === 'cookies_preferences_set' ||
            cookieValue === null || cookieValue === false) {
            return true;
        }

        // Survey cookies are dynamic; treat as 'settings'
        if (/^govuk_surveySeen/.test(cookieName) || /^govuk_taken/.test(cookieName)) {
            return window.GOVUK.checkConsentCookieCategory(cookieName, 'settings');
        }

        // Known cookie?
        if (COOKIE_CATEGORIES[cookieName]) {
            var category = COOKIE_CATEGORIES[cookieName];
            return window.GOVUK.checkConsentCookieCategory(cookieName, category);
        }

        // Unknown cookie → deny
        return false;
    };

    window.GOVUK.checkConsentCookieCategory = function (cookieName, cookieCategory) {
        var consent = window.GOVUK.getConsentCookie();

        // If no consent is stored yet but cookie is known, allow (essential baseline)
        if (!consent && COOKIE_CATEGORIES[cookieName]) return true;

        try {
            return !!(consent && consent[cookieCategory] === true);
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    // ---- Public helpers used by UI ------------------------------------------

    // Called by the banner “Accept all cookies”
    window.GOVUK.approveAllCookieTypes = function () {
        var allOn = { essential: true, settings: true, usage: true, campaigns: true };

        window.GOVUK.setCookie('cookies_preferences_set', 'true', { days: 365 });
        window.GOVUK.setConsentCookie(allOn);

        //Update UI if present
        var banner = document.getElementById('global-cookie-message');
        var confirm = document.getElementById('confirmation-cookie-message');
        if (banner) banner.style.display = 'none';
        if (confirm) confirm.style.display = 'block';
    };

    // Called by the cookies page “Save changes”
    window.GOVUK.savePreferencesSelected = function () {
        var usageAllowed = false;
        try {
            var yes = document.getElementById('radio-web_cookie-1');
            if (yes && yes.checked) usageAllowed = true;
        } catch (e) { /* ignore */ }

        console.log("usageAllowed: " + usageAllowed);

        var consent = {
            essential: true,
            usage: usageAllowed,
            campaigns: false,
            settings:  false
        };

        window.GOVUK.setConsentCookie(consent);
        window.GOVUK.setCookie('cookies_preferences_set', 'true', { days: 365 });

        // Reflect immediately in the banner if it exists
        window.GOVUK.showOrHideCookieBanner();
    };

    window.GOVUK.setDefaultConsentCookie = function () {
        window.GOVUK.setConsentCookie(DEFAULT_COOKIE_CONSENT);
    };

    // Show banner if preferences not set and not on cookies pages
    window.GOVUK.showCookieBanner = function () {
        window.GOVUK.showOrHideCookieBanner();
    };

    // Internal: centralised banner toggle
    window.GOVUK.showOrHideCookieBanner = function () {
        var banner = document.getElementById('global-cookie-message');
        if (!banner) return;

        var onCookiesPage = (window.location.pathname === '/cookies' ||
            window.location.pathname === '/cookie-details');

        var hasSetPrefs = (window.GOVUK.cookie('cookies_preferences_set') === 'true');

        if (!onCookiesPage && !hasSetPrefs) {
            banner.style.display = 'block';
            window.GOVUK.setCookie('seen_cookie_message', 'yes', { days: 28 });
        } else {
            banner.style.display = 'none';
        }
    };

    window.GOVUK.hideConfirmationBanner = function () {
        var confirm = document.getElementById('confirmation-cookie-message');
        if (confirm) confirm.style.display = 'none';
        window.GOVUK.setCookie('cookies_preferences_set', 'true', { days: 365 });
    };

    // ---- Analytics (Matomo) integration -------------------------------------

    // Apply Matomo mode immediately based on consent
    window.GOVUK.applyAnalyticsPreference = function (consent) {
        var usageOn = !!(consent && consent.usage === true);
        if (typeof window._paq === 'undefined' || !Array.isArray(window._paq)) return;

        if (!usageOn) {
            // Disable cookies and tracking calls
            try { window._paq.push(['disableCookies']); } catch (e) { /* noop */ }
        } else {
            try {
                window._paq.push(['enableLinkTracking']);
                window._paq.push(['trackPageView']);
            } catch (e) { /* noop */ }
        }
    };

    // Backwards-compatible wrapper used by your main.js
    window.GOVUK.disableMatomo = function (consent) {
        window.GOVUK.applyAnalyticsPreference(consent || window.GOVUK.getConsentCookie());
    };

    // Remove cookies for any category that is OFF
    window.GOVUK.deleteUnconsentedCookies = function () {
        var consent = window.GOVUK.getConsentCookie();
        if (!consent) return;

        // Apply analytics mode once more (defensive)
        window.GOVUK.applyAnalyticsPreference(consent);

        for (var type in consent) {
            if (Object.prototype.hasOwnProperty.call(consent, type) && consent[type] === false) {
                for (var cookieName in COOKIE_CATEGORIES) {
                    if (COOKIE_CATEGORIES[cookieName] === type) {
                        window.GOVUK.deleteCookie(cookieName);
                    }
                }
            }
        }
    };

    // ---- Optional: very light browser util (kept for IE9 guard parity) ------

    window.GOVUK.browser = window.GOVUK.browser || {
        isIe: function () { return navigator.appVersion.indexOf('MSIE') !== -1; },
        getVersion: function () {
            var version = 999;
            if (navigator.appVersion.indexOf('MSIE') !== -1) {
                version = parseFloat(navigator.appVersion.split('MSIE')[1]);
            }
            return version;
        }
    };

    // ---- Boot-time safety (first-visit baseline) ----------------------------

    // If preferences not yet set, ensure a baseline consent exists (essential only)
    if (!window.GOVUK.cookie('cookies_preferences_set')) {
        window.GOVUK.setDefaultConsentCookie();
    }

})(window);