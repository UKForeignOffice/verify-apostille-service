/**
* Model VerifyApostilleDetails.js
* @module Model VerifyApostilleDetails
*/
var verifyApostilleDetails = {

    attributes: {
        ApostilleNumber: {
            type: Sequelize.STRING
        },
        DateIssued: {
            type:Sequelize.DATE
        },
        SignedBy: {
            type: Sequelize.STRING
        },    
        ActingCapacityOf: {
            type: Sequelize.STRING
        },    
        BearsStampSeal: {
            type: Sequelize.STRING
        },    
        IssuedBy: {
            type: Sequelize.STRING
        }    

    },

    options: {
        createdAt: false,
        updatedAt: false,
        freezeTableName: false,
        tableName: 'VerifyApostille',
        classMethods: {},
        instanceMethods: {},
        hooks: {}
    }

};

module.exports = verifyApostilleDetails;

