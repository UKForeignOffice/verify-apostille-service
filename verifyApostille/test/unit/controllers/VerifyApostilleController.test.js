var request = require('supertest'),
    agent = request.agent;


describe('VerifyApostilleController', function() {
    var user;

    describe('#healthCheck()', function() {
        it('should return health check JSON', function (done) {
            user = agent(sails.hooks.http.app);
            user
                .get('/healthcheck')
                .expect(200)
                .end(function(err, res) {
                    res.body.message.should.equal('verify-apostille-service running');
                    done();
                });
        });
    });


    describe('#openApostillePage()', function() {
        it('should return apostille page view', function (done) {
            user
                .get('/verify')
                .expect(200,done);
        });
    });

    describe('#findApostille()', function() {
        it('should return apostille page view', function (done) {
            user
                .post('/details')
                .send({
                    ApostNumber : 'APO-1',
                    ApostDay : '11',
                    ApostMonth : '07',
                    ApostYear : '2016'
                })
                .expect(200,done);
        });
    });

});