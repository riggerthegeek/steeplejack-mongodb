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


module.exports.__factory = function $mongoIndexer () {

    return function mongoIndexer (db, index, tableName, opts) {

        if (_.isObject(opts) === false) {
            opts = {};
        }

        if (_.isArray(index)) {

            return bluebird
                .map(index, function (obj) {

                    return mongoIndexer(db, obj, tableName, opts);

                }, {
                    concurrency: 1
                })
                .all();

        } else {

            /* Have to clone the opts as the defaults changes the object */
            return db.collection(tableName)
                .createIndex(index, _.defaults(_.cloneDeep(opts), {
                    w: 1,
                    background: true,
                    name: _.keys(index).join("-")
                }));

        }

    };

};
