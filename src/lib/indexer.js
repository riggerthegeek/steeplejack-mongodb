/**
 * Mongo Indexer
 *
 * Helper function to create indexes
 */

"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");
var bluebird = require("bluebird");


/* Files */


function callbackPromise (promise, cb) {

    var usePromise = _.isFunction(cb) === false;

    if (usePromise) {
        return promise;
    } else {
        promise
            .then(function () {
                var args = _.toArray(arguments);

                /* Create null error */
                args.unshift(null);

                /* Run the callback */
                return cb.apply(null, args);

            })
            .catch(function (err) {
                return cb(err);
            });

    }

}


module.exports.__factory = function $mongoIndexer () {

    return function mongoIndexer (db, tableName, index, opts, cb) {

        if (_.isFunction(opts)) {
            cb = opts;
            opts = {};
        }

        if (_.isObject(opts) === false) {
            opts = {};
        }

        var promise;

        if (_.isArray(index)) {

            promise = bluebird.all(index.map(function (obj) {

                return mongoIndexer(db, tableName, obj, opts);

            }));

        } else {

            promise = db.collection(tableName)
                .createIndex(index, _.defaults(opts, {
                    w: 1,
                    background: true,
                    name: Object.keys(index).join("-")
                }));

        }

        return callbackPromise(promise, cb);

    };

};
