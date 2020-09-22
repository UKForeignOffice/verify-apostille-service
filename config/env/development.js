// /**
//  * Environment settings
//  *
//  * This file can include shared settings that override settings in indvidual files in the config folder,
//  * Here we are using environment variables and the dotenv npm package to load sensitive information
//  * that should not be included in the public repo
//  *
//  */
//
require('dotenv').config()
var applicationDatabase = JSON.parse(process.env.APPLICATIONDATABASE);

//
var config = {
    apostRegex: applicationDatabase.regex,
    piwikID: applicationDatabase.piwikId,
};
//
module.exports = config;
