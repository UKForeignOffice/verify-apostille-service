/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.http.html
 */

const crypto = require('crypto');
const cacheBust = crypto.randomBytes(4).toString('hex');

module.exports.http = {
  cache: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  middleware: {
    disablePoweredBy: function(request, response, next) {
      var expressApp = sails.hooks.http.app;
      expressApp.disable('x-powered-by');
      next();
    },
    cacheBust: function(request, response, next) {
      response.locals.cacheBust = cacheBust;
      next();
    },
    order: [
      'startRequestTimer',
      'cookieParser',
      'session',
      'bodyParser',
      'handleBodyParserError',
      'compress',
      'methodOverride',
      'cacheBust',
      'disablePoweredBy',
      'router',
      'www',
      'favicon',
      '404',
      '500'
    ],
  },
  trustProxy: true
};
