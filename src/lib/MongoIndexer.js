/**
 * Mongo Indexer
 *
 * Helper function to create indexes
 */

"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");
var async = require("async");


/* Files */


module.exports.__factory = function $mongoIndexer () {

    return function mongoIndexer (db, index, tableName, cb) {

        if (_.isArray(index)) {

            var returns = [];
            async.eachSeries(index, function (obj, callback) {

                mongoIndexer(db, obj, tableName, function (err, result) {

                    if (err) {
                        callback(err);
                        return;
                    }

                    returns.push(result);

                    callback(null);

                });

            }, function (err) {

                if (err) {
                    cb(err);
                    return;
                }

                cb(null, returns);

            });

        } else {

            db.collection(tableName).ensureIndex(index, {
                w: 1,
                background: true,
                name: Object.keys(index).join("-")
            }, cb);

        }

    };

};
