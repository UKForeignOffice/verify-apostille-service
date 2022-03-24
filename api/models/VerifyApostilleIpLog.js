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
        FirstFailedAttemptAt: {
            type: 'string',
            columnType: 'varchar(27)'
        },
        BlockedAt: {
            type: 'string',
            columnType: 'varchar(27)'
        }
    }
};
