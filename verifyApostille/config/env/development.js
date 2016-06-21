/**
 * Environment settings
 *
 * This file can include shared settings that override settings in indvidual files in the config folder,
 * Here we are using environment variables and the dotenv npm package to load sensitive information
 * that should not be included in the public repo
 *
 */

var Sequelize = require('sequelize');
var dotenv = require('dotenv');
var env = dotenv.config();

var applicationDatabase = JSON.parse(env.APPLICATIONDATABASE);
var apostilleRegex = JSON.parse(env.APOSTILLEREGEX);

module.exports = {

    connections:  {ApplicationDatabase: {
        adapter: 'sails-postgresql',
        host: applicationDatabase.host,
        user: applicationDatabase.user,
        password: applicationDatabase.password,
        database: applicationDatabase.database,
        dialect: 'postgres',
        options: {
            dialect: 'postgres',
            host: applicationDatabase.host,
            dialectOptions: {
                socketPath: ''
            },
            port: applicationDatabase.port,
            logging: true
        }
    }
    },
    apostRegex: apostilleRegex.regex

};
