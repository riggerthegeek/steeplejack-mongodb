/**
 * driver
 */

"use strict";


/* Node modules */


/* Third-party modules */
import {Base} from "steeplejack/lib/base";
import {Pool} from "generic-pool";
import {MongoClient} from "mongodb";


/* Files */
import {IConfigInterface} from "./configInterface";


/* Name with which to export this module to Steeplejack */
const name = "$mongodbDriver";


/* Configure the module */
let factory = (StoreError: any) => {

    return (config: IConfigInterface = { url: null }) => {

        /* Ensure we always receive an object for the options */
        let mongoOptions = Base.datatypes.setObject(config.mongoOptions, {});
        let poolOptions = Base.datatypes.setObject(config.poolOptions, {});

        /* Set a default name */
        if (!poolOptions.name) {
            poolOptions.name = "mongodbResource";
        }

        /* Set the constructor */
        poolOptions.create = (cb: (err: any, db: any) => any) => {

            let promise = MongoClient.connect(config.url || "mongodb://localhost", mongoOptions);

            (<any> promise)
                .then((result: any) => {
                    /* Return the database */
                    cb(null, result);
                })
                .catch((err: any) => {
                    /* Wrap the error in the StoreError class */
                    cb(new StoreError(err), null);
                });

        };

        /* Set the destructor */
        poolOptions.destroy = db => {
            return db.close();
        };


        return new Pool(poolOptions);

    };

};


export let __factory = {
    name,
    factory: [
        "StoreError",
        factory
    ]
};
