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
var session = JSON.parse(process.env.THESESSION);
var customurls = JSON.parse(process.env.CUSTOMURLS);
var apostilleRegex = JSON.parse(process.env.APOSTILLEREGEX);
//
var config = {
    // session: {
    //     cookie: {
    //         maxAge: 1800000,
    //         secure: false
    //     },
    // },
    // "session": {
    //     "secret": session.secret,
    //     "adapter": session.adapter,
    //     "url" :customurls.mongoURL,/*
    //      "host": session.host,
    //      "db": session.db,
    //      "port": session.port,
    //      "user": session.user,
    //      "password": session.password,*/
    //     "collection": session.collection,
    //     "name": session.key,
    //     "domain": session.domain,
    //     "cookie": {
    //         "maxAge": 1800000
    //     }
    // },
    "customURLs": {
        "mongoURL": customurls.mongoURL
    },
    apostRegex: apostilleRegex.regex,
    "views": {
        "locals":{
            piwikID: session.piwikId,
        }
    }
};
//
module.exports = config;
