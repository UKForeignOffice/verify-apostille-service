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
            type: 'ref',
            columnType: 'timestamp'
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
        },
        ApostilleType: {
            type: 'string'
        },
    }
};
