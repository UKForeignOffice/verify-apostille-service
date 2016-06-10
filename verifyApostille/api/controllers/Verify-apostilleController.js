/**
 * Verify-apostilleController
 *
 * @description :: Server-side logic for managing verify-apostilles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    openApostilePage: function(req,res){
        return res.view('verifyApostille.ejs');
    }
};

