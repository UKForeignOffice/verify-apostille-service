/**
 * ApostilleDetailsController module.
 * @module Controller AposilleDetailsController
 */

var apostilleDetailsController = {
    openApostillePage: function(req,res){
        return res.view('verifyApostille.ejs',{error_report:false, apost_number:false, apost_dd:false, apost_mm:false, apost_yyyy:false});
    },

    findApostille: function(req, res) {
            console.log("APOSTILLE NUMBER input RES: ", req.body);
        var errors = [];

         if(!req.body.ApostDay.match(/\d{1,2}/) || !req.body.ApostMonth.match(/\d{1,2}/) || !req.body.ApostYear.match(/\d{4}/) ){
            errors.push({link:"date-container", message:"Unfortunately we can't validate the Apostille date entered, please check that the date format is correct"})
        }

        if(!req.body.ApostNumber.match(/^[a-zA-Z]\d{6,7}/)){
            errors.push({link:"ApostNumber", message:"Please enter the complete Apostille number"})
        }
        if(errors.length > 0){
            return res.view('verifyApostille.ejs',{
                error_report : errors,
                apost_number : req.body.ApostNumber,
                apost_dd : req.body.ApostDay,
                apost_mm: req.body.ApostMonth,
                apost_yyyy: req.body.ApostYear
            });
        }

        VerifyApostilleDetails.findOne({
            where: {
                //ApostilleNumber: 'U0000000'
                ApostilleNumber: req.body.ApostNumber
            }
        }).then(function(result) {
            console.log("APOSTILLE NUMBER FOUND: ", result);
            return res.view('apostille-details.ejs', {
                ApostilleNumber: result.ApostilleNumber,
                DateIssued: result.DateIssued,
                SignedBy: result.SignedBy,
                ActingCapacityOf: result.ActingCapacityOf,
                BearsStampSeal: result.BearsStampSeal,
                IssuedBy: result.IssuedBy
            });
        })
        .catch( function(error) {
            sails.log(error);
            console.log(error);
            return res.view('verifyApostille.ejs', {
                error_report:[ {
                    link:"ApostNumber",  
                    message:"Unable to verify Apostille number."}]
            });    
        });
    }
};
module.exports = apostilleDetailsController;
