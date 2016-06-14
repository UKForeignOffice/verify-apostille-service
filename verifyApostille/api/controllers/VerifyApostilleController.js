/**
 * ApostilleDetailsController module.
 * @module Controller AposilleDetailsController
 */

var apostilleDetailsController = {
    openApostillePage: function(req,res){
        return res.view('verifyApostille.ejs',{error_report:false});
    },

    findApostille: function(req, res) {
            console.log("APOSTILLE NUMBER input RES: ", req.body);
        var errors = [];

        if(!req.body.ApostDay || !req.body.ApostMonth || !req.body.ApostYear ){
            errors.push({link:"date-container", message:"Unfortunately we can't validate the Apostille date entered, please check that the date format is correct"})
        }    

        if(!req.body.ApostNumber || (req.body.ApostNumber && req.body.ApostNumber.length<8)){
            errors.push({link:"ApostNumber", message:"Please enter the complete Apostille number"})
        }
        if(errors.length > 0){
            return res.view('verifyApostille.ejs',{error_report : errors});
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
