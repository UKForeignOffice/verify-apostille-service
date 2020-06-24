/**
 * Environment settings
 *
 * This file can include shared settings that override settings in indvidual files in the config folder,
 * Here we are using environment variables and the dotenv npm package to load sensitive information
 * that should not be included in the public repo
 *
 */

require('dotenv').config()

var applicationDatabase = JSON.parse(process.env.APPLICATIONDATABASE);
var session = JSON.parse(process.env.THESESSION);
var customurls = JSON.parse(process.env.CUSTOMURLS);
var apostilleRegex = JSON.parse(process.env.APOSTILLEREGEX);

var config = {
    // datastores: {
    //     ApplicationDatabase: {
    //         adapter: 'sails-postgresql',
    //         host: applicationDatabase.host,
    //         user: applicationDatabase.user,
    //         password: applicationDatabase.password,
    //         database: applicationDatabase.database,
    //         dialect: 'postgres',
    //         options: {
    //             dialect: 'postgres',
    //             host: applicationDatabase.host,
    //             dialectOptions: {
    //                 socketPath: ''
    //             },
    //             port: applicationDatabase.port,
    //             logging: true
    //         }
    //     }
    // },
    // "session": {
    //     "secret": session.secret,
    //     "adapter": session.adapter,
    //     "url": customurls.mongoURL,/*
    //      "host": session.host,
    //      "db": session.db,
    //      "port": session.port,
    //      "user": session.user,
    //      "password": session.password,*/
    //     "collection": session.collection,
    //     "key": session.key,
    //     "domain": session.domain,
    //     "cookie": {
    //         "maxAge": 1800000
    //     }
    // },
    "customURLs": {
        "mongoURL": customurls.mongoURL
    },
    apostRegex: apostilleRegex.regex
};

module.exports = config;
