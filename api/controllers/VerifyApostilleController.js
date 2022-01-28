/**
 * ApostilleDetailsController module.
 * @module Controller AposilleDetailsController
 */

var moment = require('moment');

var apostilleDetailsController = {

    healthCheck: function(req,res){
        res.json({ message: 'verify-apostille-service running' });
    },

    openApostillePage: function(req,res){

        return res.view('verifyApostille.ejs',{
            error_report:false,
            apost_number:false,
            apost_dd:false,
            apost_mm:false,
            apost_yyyy:false
        });
    },

    printApostille: function(req,res){
        console.log("JFS: Session Data : ", req);
        if (req.session.apostilleNumber === undefined) {
          return res.redirect('/verify');
        } else {
          return res.view('printApostille.ejs',{
            moment: moment,
            apostPrint: true,
            ApostilleNumber: req.session.apostilleNumber,
            DateIssued: req.session.dateIssued,
            SignedBy: req.session.signedBy,
            ActingCapacityOf: req.session.actingCapacityOf,
            BearsStampSeal: req.session.BearsStampSeal,
            IssuedBy: req.session.IssuedBy,
            ApostilleType: req.session.apostilleType,
          });
        }

    },

    findApostille: function(req, res) {
        // When the trust proxy setting is true, the value of this property is derived from the left-most entry in the X-Forwarded-For header.
        console.log("REQUEST IP: "  + req.ip);
        // When the trust proxy setting is true, this property contains an array of IP addresses specified in the X-Forwarded-For request header.
        console.log("REQUEST IPs: "  + req.ips);
        // X-Forwarded-For should be automatically set when using an AWS load balancer
        console.log("REQUEST HEADER: " + req.headers["X-Forwarded-For"]);

        var errors = [];

        if(!req.body.ApostDay.match(/\d{1,2}/) || !req.body.ApostMonth.match(/\d{1,2}/) || !req.body.ApostYear.match(/\d{4}/) ){
            errors.push({link:"date-container", message:"Check the date"})
        }

        // Apostille number regular expression is picked up from the environment config file.
        // e.g. /^[a-zA-Z]\d{6,7}/ matches for one leading alphabetic followed by 6 or 7 numerics.

        if(!req.body.ApostNumber.match( eval(sails.config.apostRegex) )){
            errors.push({link:"ApostNumber", message:"Check the Apostille number"})
        }

        if(errors.length > 0){
            errors.push({
                link: "ApostNumber",
                message: "If you need further help email verifyapostille@fco.gov.uk with the Apostille number and date"
            });

            return res.view('verifyApostille.ejs',{
                error_report : errors,
                apost_number : req.body.ApostNumber,
                apost_dd : req.body.ApostDay,
                apost_mm: req.body.ApostMonth,
                apost_yyyy: req.body.ApostYear
            });
        }

        req.body.ApostNumber = req.body.ApostNumber.toUpperCase();

        console.log(`Looking for apostille ${req.body.ApostNumber} on date ${req.body.ApostYear + "-" + req.body.ApostMonth + "-" + req.body.ApostDay}`)

        var startDate = req.body.ApostYear + "-" + req.body.ApostMonth + "-" + req.body.ApostDay + " 00:00:00";
        var endDate = req.body.ApostYear + "-" + req.body.ApostMonth + "-" + req.body.ApostDay + " 23:59:59";

        VerifyApostille.findOne({
            where: {
                ApostilleNumber: req.body.ApostNumber,
                DateIssued: {
                    ">=": startDate, "<": endDate
                }
            }
        }).then(function(result) {
            if (result && result !== 'undefined') {
                console.log("Found Apostille: ", result);

                return res.view('apostille-details.ejs', {
                    moment: moment,
                    ApostilleNumber: result.ApostilleNumber,
                    DateIssued: result.DateIssued,
                    SignedBy: result.SignedBy,
                    ActingCapacityOf: result.ActingCapacityOf,
                    BearsStampSeal: result.BearsStampSeal,
                    IssuedBy: result.IssuedBy,
                    ApostilleType: result.ApostilleType,
                });
            }
            else {
                console.log(`Did not find an apostille for those details. ${req.body.ApostNumber} on date ${req.body.ApostYear + "-" + req.body.ApostMonth + "-" + req.body.ApostDay}`)
                errors = [];
                errors.push({link: "date-container", message: "Check the date"});
                errors.push({link: "ApostNumber", message: "Check the Apostille number"});
                    errors.push({
                        link: "ApostNumber",
                        message: "If you need further help email verifyapostille@fco.gov.uk with the Apostille number and date"
                    });

                return res.view('verifyApostille.ejs', {
                    error_report: errors,
                    apost_number: req.body.ApostNumber,
                    apost_dd: req.body.ApostDay,
                    apost_mm: req.body.ApostMonth,
                    apost_yyyy: req.body.ApostYear
                });
            }
        })
            .catch(function (error) {
                console.log('error', error)
                errors = [];
                errors.push({link: "date-container", message: "Check the date"});
                errors.push({link: "ApostNumber", message: "Check the Apostille number"});
                errors.push({
                    link: "ApostNumber",
                    message: "If you need further help email verifyapostille@fco.gov.uk with the Apostille number and date"
                });

                return res.view('verifyApostille.ejs', {
                    error_report: errors,
                    apost_number: req.body.ApostNumber,
                    apost_dd: req.body.ApostDay,
                    apost_mm: req.body.ApostMonth,
                    apost_yyyy: req.body.ApostYear
                });
            });
    }
};
module.exports = apostilleDetailsController;
