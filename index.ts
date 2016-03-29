/**
 * MongoDB
 *
 * This is a simple wrapper for MongoDB to work with
 *
 */

"use strict";


/* Node modules */


/* Third-party modules */
import {Plugin} from "steeplejack/lib/plugin";


/* Files */
import * as driver from "./src/driver";

console.log(driver);


/* Add the modules to the plugin */
export let mongodb = new Plugin([
    driver
]);
