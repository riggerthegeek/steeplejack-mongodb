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
var bluebird = require("bluebird");
var mongodb = require("mongodb");
var poolModule = require("generic-pool");
var steeplejack = require("steeplejack");

var datatypes = steeplejack.Base.datatypes;

var Db = mongodb.Db;
var Server = mongodb.Server;


/* Files */


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

        var db = new Db(config.db, new Server(config.host, config.port), {
            w: 1
        });

        /* Open the database */
        db.open()
            .then(function (db) {

                var username = config.username;
                var password = config.password;

                /* Do we want to authenticate */
                if (username) {

                    return db
                        .authenticate(username, password)
                        .then(function (result) {

                            if (result !== true) {
                                return bluebird.reject("Cannot authenticate the MongoDB");
                            }

                            return db;

                        });

                }

                return db;

            })
            .then(function (db) {
                /* Successfully connected - return the callback */
                cb(null, db);
            })
            .catch(function (err) {
                /* Wrap in a StoreError */
                cb(new StoreError(err), null);
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
