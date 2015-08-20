/**
 * main.test
 */

"use strict";


/* Node modules */


/* Third-party modules */
var proxyquire = require("proxyquire");


/* Files */


describe("main test", function () {


    var main,
        Plugin,
        driver,
        indexer;
    beforeEach(function () {

        Plugin = sinon.spy();
        driver = sinon.spy();
        indexer = sinon.spy();

        main = proxyquire("../../src/main", {
            steeplejack: {
                Plugin: Plugin
            },
            "./lib/driver": driver,
            "./lib/indexer": indexer
        });

    });


    it("should expose the plugin files", function () {

        expect(Plugin).to.be.calledOnce
            .calledWithNew
            .calledWithExactly([
                driver,
                indexer
            ]);

        expect(main).to.be.instanceof(Plugin);

    });


});
