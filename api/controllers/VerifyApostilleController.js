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

    // /details -> findApostile
    findApostille: function(req, res) {
        console.log("REQUEST QUERY: " + JSON.stringify(req.query));

        var errors = [];

        if(!req.query.ApostDay.match(/\d{1,2}/) || !req.query.ApostMonth.match(/\d{1,2}/) || !req.query.ApostYear.match(/\d{4}/) ){
            errors.push({link:"date-container", message:"Check the date"})
        }

        // Apostille number regular expression is picked up from the environment config file.
        // e.g. /^[a-zA-Z]\d{6,7}/ matches for one leading alphabetic followed by 6 or 7 numerics.

        if(!req.query.ApostNumber.match( eval(sails.config.apostRegex) )){
            errors.push({link:"ApostNumber", message:"Check the Apostille number"})
        }

        if(errors.length > 0){
            errors.push({
                link: "ApostNumber",
                message: "If you need further help email verifyapostille@fco.gov.uk with the Apostille number and date"
            });

            return res.view('verifyApostille.ejs',{
                error_report : errors,
                apost_number : req.query.ApostNumber,
                apost_dd : req.query.ApostDay,
                apost_mm: req.query.ApostMonth,
                apost_yyyy: req.query.ApostYear
            });
        }

        req.query.ApostNumber = req.query.ApostNumber.toUpperCase();

        console.log(`Looking for apostille ${req.query.ApostNumber} on date ${req.query.ApostYear + "-" + req.query.ApostMonth + "-" + req.query.ApostDay}`)

        var startDate = req.query.ApostYear + "-" + req.query.ApostMonth + "-" + req.query.ApostDay + " 00:00:00";
        var endDate = req.query.ApostYear + "-" + req.query.ApostMonth + "-" + req.query.ApostDay + " 23:59:59";

        VerifyApostille.findOne({
            where: {
                ApostilleNumber: req.query.ApostNumber,
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
                console.log(`Did not find an apostille for those details. ${req.query.ApostNumber} on date ${req.query.ApostYear + "-" + req.query.ApostMonth + "-" + req.query.ApostDay}`)
                errors = [];
                errors.push({link: "date-container", message: "Check the date"});
                errors.push({link: "ApostNumber", message: "Check the Apostille number"});
                    errors.push({
                        link: "ApostNumber",
                        message: "If you need further help email verifyapostille@fco.gov.uk with the Apostille number and date"
                    });

                return res.view('verifyApostille.ejs', {
                    error_report: errors,
                    apost_number: req.query.ApostNumber,
                    apost_dd: req.query.ApostDay,
                    apost_mm: req.query.ApostMonth,
                    apost_yyyy: req.query.ApostYear
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
                    apost_number: req.query.ApostNumber,
                    apost_dd: req.query.ApostDay,
                    apost_mm: req.query.ApostMonth,
                    apost_yyyy: req.query.ApostYear
                });
            });
    }
};
module.exports = apostilleDetailsController;
