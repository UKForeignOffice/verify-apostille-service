/**
 * Verify-apostilleController
 *
 * @description :: Server-side logic for managing verify-apostilles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    openApostilePage: function(req,res){
        return res.view('verifyApostille.ejs');
        //return res.view('index.ejs');
    },
    details: function (req, res) {
        //res.send("Verify Apostille Details!");
        //return res.view("details.ejs");
        return res.view("apostille-details.ejs");
    }
};

