/**
 * sinon
 */

"use strict";


/* Node modules */


/* Third-party modules */
global.chai = require("chai");
global.sinon = require("sinon");

require("sinon-as-promised")(require("bluebird"));


/* Files */


chai.use(require("sinon-chai"));
chai.use(require("chai-as-promised"));
global.expect = chai.expect;
