/**
* Model VerifyApostilleDetails.js
* @module Model VerifyApostilleDetails
*/
var verifyApostilleDetails = {

    timestamps: false,

    createdAt: false,
    updatedAt: false,

    attributes: {
        ApostilleNumber: {
            type: Sequelize.STRING
        },
        DateIssued: {
            type: Sequelize.DATEONLY
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
        freezeTableName: false,
        tableName: 'VerifyApostille',
        classMethods: {},
        instanceMethods: {},
        hooks: {}
    }

};

module.exports = verifyApostilleDetails;

