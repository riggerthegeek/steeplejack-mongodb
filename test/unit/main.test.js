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
        PoolGrabber;
    beforeEach(function () {

        Plugin = sinon.spy();
        PoolGrabber = sinon.spy();

        main = proxyquire("../../src/main", {
            steeplejack: {
                Plugin: Plugin
            },
            //"./lib/PoolGrabber": PoolGrabber
        });

    });


    it("should expose the plugin files", function () {

        expect(Plugin).to.be.calledOnce
            .calledWithNew
            .calledWithExactly([
                //PoolGrabber
            ]);

        expect(main).to.be.instanceof(Plugin);

    });


});
