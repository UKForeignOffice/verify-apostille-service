var browser = {
    isIe: function () {
        return navigator.appVersion.indexOf("MSIE") != -1;
    },
    navigator: navigator.appVersion,
    getVersion: function() {
        var version = 999; // we assume a sane browser
        if (navigator.appVersion.indexOf("MSIE") != -1)
            // bah, IE again, lets downgrade version number
            version = parseFloat(navigator.appVersion.split("MSIE")[1]);
        return version;
    }
};

$(document).ready(function () {

    $('#accept-all-cookies').click(function(event){
        if (browser.isIe() && browser.getVersion() <= 9) {
            return true;
        }
        GOVUK.approveAllCookieTypes();
    });


    $('#hide-confirmation').click(function(event){
        if (browser.isIe() && browser.getVersion() <= 9) {
            return true;
        }
        GOVUK.hideConfirmationBanner();
    });

    $('#preference-cookies').click(function(event){
        if (browser.isIe() && browser.getVersion() <= 9) {
            return true;
        }
        //redirects to cookie screen, could maybe be a new tab instead
        window.location ="/cookies";
    });

    $('#save-cookie-changes').off('click').on('click', function (event) {
        if (browser.isIe() && browser.getVersion() <= 9) {
            return true;
        }
        event.preventDefault();

        try {
            GOVUK.savePreferencesSelected();

            if (typeof GOVUK.hideConfirmationBanner === 'function') {
                GOVUK.hideConfirmationBanner();
            }

            window.location.href = '/';
        } catch (err) {
            console.error('Failed to save cookie preferences:', err);
        }
    });


    //Display cookie banner(if required)
    GOVUK.showCookieBanner();

    //set default/essential cookies if policy not set (user hasnt accepted all)
    if (!GOVUK.cookie('cookies_preferences_set')) {
        GOVUK.setDefaultConsentCookie();
    }
    //disable matomo if required
    GOVUK.disableMatomo(GOVUK.getConsentCookie());

    //------end of cookies

    $('#close-page-button').click(function(){
        window.close();
    });

});