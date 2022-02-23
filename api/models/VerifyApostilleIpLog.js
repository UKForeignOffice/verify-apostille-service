module.exports = {
    datastore: 'ApplicationDatabase',
    tableName: 'VerifyApostilleIpLog',
    attributes: {
        id: {
            type: 'string',
            columnName: 'Ip',
            columnType: 'inet',
            required: true
        },
        FailedAttempts: {
            type: 'number',
            columnType: 'integer'
        },
        BlockedAtInMillis: {
            type: 'string',
            columnType: 'bigint'
        }
    }
};
