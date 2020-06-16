/**
* Model VerifyApostille.js
* @module Model VerifyApostilleDetails
*/
module.exports = {
    datastore: 'ApplicationDatabase',
    tableName: 'VerifyApostille',
    attributes: {
        id: {
            type: 'number',
            columnName: 'UID',
            required: true
        },
        ApostilleNumber: {
          type: 'string'
        },
        DateIssued: {
          type: 'string',
          columnType: 'date'
        },
        SignedBy: {
          type: 'string'
        },
        ActingCapacityOf: {
          type: 'string'
        },
        BearsStampSeal: {
          type: 'string'
        },
        IssuedBy: {
          type: 'string'
        }
    }
};


