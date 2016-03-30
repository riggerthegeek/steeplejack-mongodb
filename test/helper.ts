/**
 * helper
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


import * as chai from "chai";
let chaiAsPromised = require("chai-as-promised");
import * as proxyquire from "proxyquire";
import * as sinon from "sinon";
let sinonAsPromised = require("sinon-as-promised");
import sinonChai = require("sinon-chai");

chai.use(sinonChai);
chai.use(chaiAsPromised);

let expect = chai.expect;

proxyquire.noCallThru();


export {
    expect,
    proxyquire,
    sinon
};
