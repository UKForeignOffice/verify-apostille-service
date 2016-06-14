/**
 * ApostilleDetailsController module.
 * @module Controller AposilleDetailsController
 */


//var thisPagesTitle = "Verify Result";

var apostilleDetailsController = {


    details: function(req, res) {
            console.log("APOSTILLE NUMBER input RES: ", req.body);
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
            });    
        });
    }
};
module.exports = apostilleDetailsController;
