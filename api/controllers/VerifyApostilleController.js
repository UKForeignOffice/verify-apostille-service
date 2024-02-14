/**
 * ApostilleDetailsController module.
 * @module Controller AposilleDetailsController
 */

var moment = require('moment');

var apostilleDetailsController = {

    healthCheck: function(req,res){
        res.json({ message: 'verify-apostille-service running' });
    },

    maintenance: function(req, res){
        return res.view('maintenance');
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
            ApostilleType: req.session.apostilleType.toLowerCase(),
          });
        }

    },

    findApostille: async function(req, res) {
        console.log("Got apostille request", req.body);

        try {
            // req.ip is derived from left-most entry in X-Forwarded-For header
            if(await IpService.shouldIPBeRateLimited(req.ip) == false) {
                var errors = [];

                if(!req.body.ApostDay.match(/\d{1,2}/) || !req.body.ApostMonth.match(/\d{1,2}/) || !req.body.ApostYear.match(/\d{4}/) ) {
                    errors.push({link:"date-container", message:"Check the date"})
                }

                // Apostille number regular expression is picked up from the environment config file.
                // e.g. /^[a-zA-Z]\d{6,7}/ matches for one leading alphabetic followed by 6 or 7 numerics.

                if(!req.body.ApostNumber.match( eval(sails.config.apostRegex) )) {
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

                console.log(`${req.ip} Looking for apostille ${req.body.ApostNumber} on date ${req.body.ApostYear + "-" + req.body.ApostMonth + "-" + req.body.ApostDay}`)

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
                        let formattedDateIssued = moment(result.DateIssued).format('YYYY-MM-DD');
                        console.log(`${req.ip} Lookup SUCCESS: ${result.ApostilleNumber} on date ${formattedDateIssued}`);

                        return res.view('apostille-details.ejs', {
                            moment: moment,
                            ApostilleNumber: result.ApostilleNumber,
                            DateIssued: result.DateIssued,
                            SignedBy: result.SignedBy,
                            ActingCapacityOf: result.ActingCapacityOf,
                            BearsStampSeal: result.BearsStampSeal,
                            IssuedBy: result.IssuedBy,
                            ApostilleType: result.ApostilleType.toLowerCase(),
                        });
                    }
                    else {
                        IpService.logFailedRequestForIp(req.ip);

                        console.log(`${req.ip} Lookup FAIL: ${req.body.ApostNumber} on date ${req.body.ApostYear + "-" + req.body.ApostMonth + "-" + req.body.ApostDay}`)
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
                }).catch(function (error) {
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
            } else {
                res.redirect('/rate-limit');
            }
        } catch(error) {
            console.error(error);
            return res.view('500.ejs')
        }
    }
};
module.exports = apostilleDetailsController;
