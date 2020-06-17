/**
 * Session Configuration
 * (sails.config.session)
 *
 * Use the settings below to configure session integration in your app.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For all available options, see:
 * https://sailsjs.com/config/session
 */

var dotenv = require('dotenv');
var env = dotenv.config({path: process.env.DOTENV || '.env'});
var applicationDatabase = JSON.parse(env.APPLICATIONDATABASE);
var session = JSON.parse(env.THESESSION);


module.exports.session = {

    /***************************************************************************
     *                                                                          *
     * Session secret is automatically generated when your new app is created   *
     * Replace at your own risk in production-- you will invalidate the cookies *
     * of your users, forcing them to log in again.                             *
     *                                                                          *
     ***************************************************************************/
    secret: session.secret,

    adapter: 'connect-mongo',

    // Note: in this URL, `user`, `pass` and `port` are all optional.
    // url: `mongodb://${session.user}:${session.pass}@${session.host}:${session.user}port/${session.db}`,
    url: 'mongodb://localhost:27017/',

    //--------------------------------------------------------------------------
    // The following additional options may also be used, if needed:
    // (See http://bit.ly/mongooptions for more about `mongoOptions`.)
    //--------------------------------------------------------------------------
    // collection: 'sessions',
    // stringify: true,
    // auto_reconnect: false,
    // mongoOptions: {
    //   server: {
    //     ssl: true
    //   }


    /***************************************************************************
     *                                                                          *
     * Customize when built-in session support will be skipped.                 *
     *                                                                          *
     * (Useful for performance tuning; particularly to avoid wasting cycles on  *
     * session management when responding to simple requests for static assets, *
     * like images or stylesheets.)                                             *
     *                                                                          *
     * https://sailsjs.com/config/session                                       *
     *                                                                          *
     ***************************************************************************/
    // isSessionDisabled: function (req){
    //   return !!req.path.match(req._sails.LOOKS_LIKE_ASSET_RX);
    // },

};
