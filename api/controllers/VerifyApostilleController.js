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

        req.session.errCnt = 0; // TODO: Might want to clear this at elsewhere.

        return res.view('verifyApostille.ejs',{
            error_report:false,
            apost_number:false,
            apost_dd:false,
            apost_mm:false,
            apost_yyyy:false
        });
    },

    printApostille: function(req,res){
        console.log("JFS: Session Data : ", req.session);
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
            IssuedBy: req.session.IssuedBy
          });
        }

    },

    findApostille: function(req, res) {
        console.log("APOSTILLE NUMBER input RES: ", req.body);
        var errors = [];

        if(!req.body.ApostDay.match(/\d{1,2}/) || !req.body.ApostMonth.match(/\d{1,2}/) || !req.body.ApostYear.match(/\d{4}/) ){
            //errors.push({link:"date-container", message:"Enter a valid date"})
            errors.push({link:"date-container", message:"Check the date"})
        }

        // Apostille number regular expression is picked up from the environment config file.
        // e.g. /^[a-zA-Z]\d{6,7}/ matches for one leading alphabetic followed by 6 or 7 numerics.

        if(!req.body.ApostNumber.match( eval(sails.config.apostRegex) )){
            //errors.push({link:"ApostNumber", message:"Enter a complete apostille number"})
            errors.push({link:"ApostNumber", message:"Check the apostille number"})
        }

        if(errors.length > 0){
            req.session.errCnt++;

            if (req.session.errCnt > 2 ){
                errors.push({
                    link:"ApostNumber",
                    message: "If you need further help email verifyapostille@fco.gov.uk with the apostille number and date"
                });
            }

            return res.view('verifyApostille.ejs',{
                error_report : errors,
                apost_number : req.body.ApostNumber,
                apost_dd : req.body.ApostDay,
                apost_mm: req.body.ApostMonth,
                apost_yyyy: req.body.ApostYear
            });
        }

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

            req.session.apostilleNumber = result.ApostilleNumber;
            req.session.dateIssued = result.DateIssued;
            req.session.signedBy = result.SignedBy;
            req.session.actingCapacityOf = result.ActingCapacityOf;
            req.session.BearsStampSeal = result.BearsStampSeal;
            req.session.IssuedBy = result.IssuedBy;

            console.log("Found Apostille: ", result);

            return res.view('apostille-details.ejs', {
                moment: moment,
                ApostilleNumber: req.session.apostilleNumber,
                DateIssued: req.session.dateIssued,
                SignedBy: req.session.signedBy,
                ActingCapacityOf: req.session.actingCapacityOf,
                BearsStampSeal: req.session.BearsStampSeal,
                IssuedBy: req.session.IssuedBy
            });
        })
            .catch( function(error) {
                sails.log(error);
                console.log(error);
                req.session.errCnt++;

                errors = [];
                errors.push({link:"date-container", message:"Check the date"});
                errors.push({link:"ApostNumber", message:"Check the apostille number"});
                if (req.session.errCnt > 2 ){
                    errors.push({
                        link:"ApostNumber",
                        message: "If you need further help email verifyapostille@fco.gov.uk with the apostille number and date"
                    });
                }

                return res.view('verifyApostille.ejs', {
                    error_report: errors,
                    apost_number : req.body.ApostNumber,
                    apost_dd : req.body.ApostDay,
                    apost_mm: req.body.ApostMonth,
                    apost_yyyy: req.body.ApostYear
                });
            });
    }
};
module.exports = apostilleDetailsController;
