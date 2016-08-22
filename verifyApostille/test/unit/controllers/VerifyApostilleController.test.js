var request = require('supertest'),
    agent = request.agent;


describe('VerifyApostilleController', function() {
    describe('#healthCheck()', function() {
        it('should return health check JSON', function (done) {
            var user = agent(sails.hooks.http.app);
            user
                .get('/healthcheck')
                .expect(200)
                .end(function(err, res) {
                    res.body.message.should.equal('verify-apostille-service running');
                    done();

                });
        });
    });

});