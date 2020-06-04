var Sails = require('sails'),
    sails;

before(function(done) {

    // Increase the Mocha timeout so that Sails has enough time to lift.
    this.timeout(10000);

    Sails.lift({
        port:1338,
        hooks: {
            //"sequelize": require('../'),
            // Load the hook
            "orm": false,
            "pubsub": false,
            // Skip grunt (unless your hook uses it)
            "grunt": false
        }
    }, function(err, server) {
        sails = server;
        if (err) return done(err);
        // here you can load fixtures, etc.

        done(err, sails);
    });
});

after(function(done) {
    // here you can clear fixtures, etc.
    Sails.lower(done);
});