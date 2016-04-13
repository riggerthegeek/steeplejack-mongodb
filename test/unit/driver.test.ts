/**
 * driver.test
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {expect, proxyquire, sinon} from "../helper";
import {__factory} from "../../lib/driver";


describe("MongoDB driver test", function () {

    describe("real", function () {

        it("should correctly configure the factory endpoint", function () {

            expect(__factory).to.be.an("object");

            expect(__factory).to.have.keys([
                "name",
                "factory"
            ]);

            expect(__factory.name).to.be.equal("$mongodbDriver");

            expect(__factory.factory).to.be.an("array")
                .have.length(2);

            expect(__factory.factory[0]).to.be.equal("StoreError");
            expect(__factory.factory[1]).to.be.a("function");

        });

    });

    describe("stubbed", function () {

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

        it("should build with the default options and connect", function (done: any) {

            let driver = this.driver();

            expect(driver).to.be.instanceof(this.Pool);

            expect(driver.data).to.have.keys([
                "name",
                "create",
                "destroy"
            ]);

            expect(driver.data.name).to.be.equal("mongodbResource");

            expect(driver.data.create).to.be.a("function");
            expect(driver.data.destroy).to.be.a("function");

            this.mongoConnect.connect.resolves("result");

            driver.data.create((err: any, db: any) => {

                try {
                    expect(err).to.be.null;

                    expect(db).to.be.equal("result");

                    expect(this.mongoConnect.connect).to.be.calledOnce
                        .calledWithExactly("mongodb://localhost", {});

                    done();
                } catch (err) {
                    done(err);
                }

            });

            let client = {
                close: sinon.stub().returns("destroyed")
            };
            expect(driver.data.destroy(client)).to.be.equal("destroyed");

            expect(client.close).to.be.calledOnce
                .calledWithExactly();

        });

        it("should build with the default options and fail to connect", function (done: any) {

            let driver = this.driver();

            expect(driver).to.be.instanceof(this.Pool);

            expect(driver.data).to.have.keys([
                "name",
                "create",
                "destroy"
            ]);

            expect(driver.data.name).to.be.equal("mongodbResource");

            expect(driver.data.create).to.be.a("function");
            expect(driver.data.destroy).to.be.a("function");

            this.mongoConnect.connect.rejects("myerr");

            driver.data.create((err: any, db: any) => {

                try {
                    expect(err).to.be.instanceof(this.StoreError);

                    expect(db).to.be.null;

                    expect(this.mongoConnect.connect).to.be.calledOnce
                        .calledWithExactly("mongodb://localhost", {});

                    expect(this.StoreError).to.be.calledOnce
                        .calledWithExactly(new Error("myerr"));

                    done();
                } catch (err) {
                    done(err);
                }

            });

            let client = {
                close: sinon.stub().returns("destroyed")
            };
            expect(driver.data.destroy(client)).to.be.equal("destroyed");

            expect(client.close).to.be.calledOnce
                .calledWithExactly();

        });

        it("should build with the empty object and use default options", function (done: any) {

            let driver = this.driver({});

            expect(driver).to.be.instanceof(this.Pool);

            expect(driver.data).to.have.keys([
                "name",
                "create",
                "destroy"
            ]);

            expect(driver.data.name).to.be.equal("mongodbResource");

            expect(driver.data.create).to.be.a("function");
            expect(driver.data.destroy).to.be.a("function");

            this.mongoConnect.connect.resolves("result");

            driver.data.create((err: any, db: any) => {

                try {

                    expect(err).to.be.null;

                    expect(db).to.be.equal("result");

                    expect(this.mongoConnect.connect).to.be.calledOnce
                        .calledWithExactly("mongodb://localhost", {});

                    done();

                } catch (err) {
                    done(err);
                }

            });

            let client = {
                close: sinon.stub().returns("destroyed")
            };
            expect(driver.data.destroy(client)).to.be.equal("destroyed");

            expect(client.close).to.be.calledOnce
                .calledWithExactly();

        });

        it("should build with set options and connect", function (done: any) {

            let driver = this.driver({
                url: "mongodb://10.20.30.40:28093/db",
                mongoOptions: {
                    arg1: true,
                    arg2: "hello",
                    arg3: false
                },
                poolOptions: {
                    name: "myname",
                    max: 22,
                    min: 3,
                    refreshIdle: false,
                    idleTimeoutMillis: 27000,
                    reapIntervalMillis: 203,
                    returnToHead: true,
                    priorityRange: 3,
                    validate: () => {
                        return 2;
                    },
                    validateAsync: () => {
                        return 3;
                    },
                    log: true
                }
            });

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

            expect(driver.data.name).to.be.equal("myname");
            expect(driver.data.max).to.be.equal(22);
            expect(driver.data.min).to.be.equal(3);
            expect(driver.data.refreshIdle).to.be.false;
            expect(driver.data.idleTimeoutMillis).to.be.equal(27000);
            expect(driver.data.reapIntervalMillis).to.be.equal(203);
            expect(driver.data.returnToHead).to.be.true;
            expect(driver.data.priorityRange).to.be.equal(3);
            expect(driver.data.validate).to.be.a("function");
            expect(driver.data.validateAsync).to.be.a("function");
            expect(driver.data.log).to.be.true;

            expect(driver.data.validate()).to.be.equal(2);
            expect(driver.data.validateAsync()).to.be.equal(3);

            expect(driver.data.create).to.be.a("function");
            expect(driver.data.destroy).to.be.a("function");

            this.mongoConnect.connect.resolves("result");

            driver.data.create((err: any, db: any) => {

                try {
                    expect(err).to.be.null;

                    expect(db).to.be.equal("result");

                    expect(this.mongoConnect.connect).to.be.calledOnce
                        .calledWithExactly("mongodb://10.20.30.40:28093/db", {
                            arg1: true,
                            arg2: "hello",
                            arg3: false
                        });

                    done();

                } catch (err) {
                    done(err);
                }

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
