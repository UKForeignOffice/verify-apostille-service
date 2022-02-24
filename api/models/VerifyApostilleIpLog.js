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
        BlockedAt: {
            type: 'string',
            columnType: 'varchar(27)'
        }
    }
};
