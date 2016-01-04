/**
 * MongoDB
 *
 * Creates a MongoDB resource.  This is designed to
 * be used during the config phase of the project to
 * create a instance of a MongoDB resource.  This way,
 * we can have multiple different connections peacefully
 * co-existing.
 */

"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");
var bluebird = require("bluebird");
var mongodb = require("mongodb");
var poolModule = require("generic-pool");
var steeplejack = require("steeplejack");

var datatypes = steeplejack.Base.datatypes;


/* Files */


/**
 * Parse Connection URL
 *
 * Converts the config object into a database
 * string
 *
 * @param {object} config
 * @returns {string}
 */
function parseConnectionUrl (config) {

    var url = [
        "mongodb://"
    ];

    var username = config.username;

    if (username) {

        url.push(username);
        url.push(":");
        url.push(config.password);
        url.push("@");

    }

    if (config.host) {
        url.push(config.host);
    } else {
        url.push("localhost");
    }

    if (config.port) {
        url.push(":");
        url.push(config.port);
    }

    if (config.db) {
        url.push("/");
        url.push(config.db);
    }

    return url.join("");

}


/**
 * Create Connection
 *
 * This is a factory that actually creates the
 * MongoDB connection.
 *
 * If it detects a username, it will authenticate
 * this connection.
 *
 * config = {
 *     db: string,          // the database to connect to
 *     host: string,        // the host to connect on
 *     username: string,    // the username
 *     password: string,    // password
 *     port: number         // port number
 * }
 *
 * @param {object} config
 * @param {function} StoreError
 * @returns {Function}
 */
function createConnection (config, StoreError) {

    return function (cb) {

        var url = parseConnectionUrl(config);

        var promise = mongodb.connect(url, {
            promiseLibrary: bluebird
        });

        var noPromise = _.isFunction(cb);

        return promise.then(function (db) {

            /* Successfully connected - return the callback */
            if (noPromise) {
                cb(null, db);
            } else {
                return db;
            }

        })
        .catch(function (err) {

            /* Wrap in a StoreError */
            err = new StoreError(err);

            if (noPromise) {
                cb(err);
            } else {
                throw err;
            }

        });

    };

}


/**
 * Destroy Connection
 *
 * Factory to close the connection to the database
 *
 * @returns {Function}
 */
function destroyConnection () {

    return function (client) {
        client.close();
    };

}


module.exports.__factory = function $mongodbDriver (StoreError) {

    return function mongoDBFactory (config) {

        /* Ensure config is an object */
        config = datatypes.setObject(config, {});

        return poolModule.Pool({
            name: config.name || "mongodb",
            create: createConnection(config, StoreError),
            destroy: destroyConnection(),
            max: config.maxConnections,
            min: config.minConnections,
            idleTimeoutMillis: config.timeout,
            log: config.log || false
        });

    };

};
