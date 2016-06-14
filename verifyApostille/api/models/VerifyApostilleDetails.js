/**
* Model VerifyApostilleDetails.js
* @module Model VerifyApostilleDetails
*/
var verifyApostilleDetails = {


  // I don't want createdAt
  //   createdAt: false,
  //
  //     // I want updatedAt to actually be called updateTimestamp
  //       updatedAt: 'updateTimestamp'
  //
  //         // And deletedAt to be called destroyTime (remember to enable paranoid for this to work)
  //           deletedAt: 'destroyTime',
  //             paranoid: true


    timestamps: false,

    createdAt: false,
    updatedAt: false,


    attributes: {
        ApostilleNumber: {
            type: Sequelize.STRING
        },
        DateIssued: {
            type: Sequelize.STRING
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

