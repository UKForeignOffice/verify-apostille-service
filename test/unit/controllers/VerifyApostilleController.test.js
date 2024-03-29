var request = require('supertest'),
    agent = request.agent;
var chai = require('chai')
var expect = chai.expect

describe('VerifyApostilleController', function() {
    var user;

    describe('#healthCheck()', function() {
        it('should return health check JSON', function (done) {
            user = agent(sails.hooks.http.app);
            user
                .get('/healthcheck')
                .expect(200)
                .end(function(err, res) {
                    expect(res.body.message).to.equal('verify-apostille-service running')
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
        it('should return apostille results -- successful', function (done) {
            user
                .post('/details')
                .send({
                    ApostNumber : 'APO-1',
                    ApostDay : '11',
                    ApostMonth : '07',
                    ApostYear : '2016'
                })
                .expect(302,done);
        });

        it('should return apostille results -- unsuccessful', function (done) {
            user
                .post('/details')
                .send({
                    ApostNumber : 'A754dgojkPO-1',
                    ApostDay : '11',
                    ApostMonth : '07',
                    ApostYear : '2016'
                })
                .expect(302,done);
        });

        it('should return apostille results -- unsuccessful', function (done) {
            user
                .post('/details')
                .send({
                    ApostNumber : 'djkjngkjaodkgjak;hk##lf;kghmjn-1',
                    ApostDay : '11',
                    ApostMonth : '07',
                    ApostYear : '2016'
                })
                .expect(302,done);
        });

        it('should return apostille results -- unsuccessful', function (done) {
            user
                .post('/details')
                .send({
                    ApostNumber : '65268674545848547',
                    ApostDay : 'dff',
                    ApostMonth : 'ag',
                    ApostYear : 'aga'
                })
                .expect(302,done);
        });
    });

});
