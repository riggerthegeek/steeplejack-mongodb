/**
 * driver.test
 */

"use strict";


/* Node modules */


/* Third-party modules */
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


/* Files */
import {__factory} from "../lib/driver";


describe("MongoDB driver test", function () {

    describe("real", function () {

        it("should correctly configure the factory endpoint", function () {

            expect(__factory).to.be.an("object");

            expect(__factory).to.have.keys([
                "name",
                "factory"
            ]);

            expect(__factory.name).to.be.equal("$mongodbResource");

            expect(__factory.factory).to.be.an("array")
                .have.length(2);

            expect(__factory.factory[0]).to.be.equal("StoreError");
            expect(__factory.factory[1]).to.be.a("function");

        });

    });

    describe.only("stubbed", function () {

        beforeEach(function () {

            this.mongoConnect = {
                connect: sinon.stub()
            };

            this.Pool = function (obj) {
                /* Gets the object sent to the pool */
                this.data = obj;
            };

            let driver = proxyquire("../lib/driver", {
                "generic-pool": {
                    Pool: this.Pool
                },
                mongodb: {
                    MongoClient: this.mongoConnect
                }
            }).__factory.factory[1];

            this.StoreError = sinon.stub();

            this.driver = driver(this.StoreError);

        });

        it("should build with the default options", function (done: any) {

            let driver = this.driver();

            expect(driver).to.be.instanceof(this.Pool);

            expect(driver.data).to.have.keys([
                "name",
                "max",
                "min",
                "refreshIdle",
                "idleTimeoutMillis",
                "reapIntervalMillis",
                "returnToHead",
                "priorityRange",
                "validate",
                "validateAsync",
                "log",
                "create",
                "destroy"
            ]);

            expect(driver.data.name).to.be.equal("mongodbResource");
            expect(driver.data.max).to.be.undefined;
            expect(driver.data.min).to.be.undefined;
            expect(driver.data.refreshIdle).to.be.undefined;
            expect(driver.data.idleTimeoutMillis).to.be.undefined;
            expect(driver.data.reapIntervalMillis).to.be.undefined;
            expect(driver.data.returnToHead).to.be.undefined;
            expect(driver.data.priorityRange).to.be.undefined;
            expect(driver.data.validate).to.be.undefined;
            expect(driver.data.validateAsync).to.be.undefined;
            expect(driver.data.log).to.be.undefined;

            expect(driver.data.create).to.be.a("function");
            expect(driver.data.destroy).to.be.a("function");

            this.mongoConnect.connect.resolves("result");

            driver.data.create((err: any, db: any) => {

                expect(err).to.be.null;

                expect(db).to.be.equal("result");

                expect(this.mongoConnect.connect).to.be.calledOnce
                    .calledWithExactly("mongodb://localhost", {});

                done();

            });

            let client = {
                close: sinon.stub().returns("destroyed")
            };
            expect(driver.data.destroy(client)).to.be.equal("destroyed");

            expect(client.close).to.be.calledOnce
                .calledWithExactly();

        });

    });

});
