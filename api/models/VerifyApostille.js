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
            type: 'string',
            allowNull: true
        },
        ActingCapacityOf: {
            type: 'string',
            allowNull: true
        },
        BearsStampSeal: {
            type: 'string',
            allowNull: true
        },
        IssuedBy: {
            type: 'string',
            allowNull: true
        },
        ApostilleType: {
            type: 'string',
            allowNull: true
        }
    }
};
