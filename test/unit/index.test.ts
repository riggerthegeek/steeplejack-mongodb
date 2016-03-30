/**
 * index.test
 */

"use strict";


/* Node modules */


/* Third-party modules */
import {Plugin} from "steeplejack/lib/plugin";


/* Files */
import {expect} from "../helper";
import * as driver from "../../lib/driver";
import {mongodb} from "../../index";


describe("config test", function () {

    it("should create a plugin", function () {

        expect(mongodb).to.be.instanceof(Plugin);

        expect(mongodb.modules).to.be.an("array")
            .have.length(1);

        expect(mongodb.modules[0]).to.be.equal(driver);

    });

});
