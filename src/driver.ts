/**
 * driver
 */

"use strict";


/* Node modules */


/* Third-party modules */
import {Pool} from "generic-pool";


/* Files */
import {IConfigInterface} from "./configInterface";


/* The name of the module */
const name = "$mongodbResource";


/* Factory */
function factory () {

    return (config: IConfigInterface = {}) => {

        return new Pool({
            name: config.name || "mongodbResource",
            max: config.max,
            min: config.min,
            refreshIdle: config.refreshIdle,
            idleTimeoutMillis: config.idleTimeoutMillis,
            reapIntervalMillis: config.reapIntervalMillis,
            returnToHead: config.returnToHead,
            priorityRange: config.priorityRange,
            validate: config.validate,
            validateAsync: config.validateAsync,
            log: config.log,
            create: cb => {
                
            },
            destroy: client => {
                return client.close();
            }
        });

    };

}


/* Define the module to export */
export let __factory = {
    name,
    factory
};
