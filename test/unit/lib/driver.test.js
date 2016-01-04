/**
 * mongodb
 */

"use strict";


/* Node modules */


/* Third-party modules */
var bluebird = require("bluebird");
var proxyquire = require("proxyquire");


/* Files */


describe("mongodb test", function () {

    var mongodb,
        mongodbDep,
        dbInst,
        Pool,
        StoreError;
    beforeEach(function () {

        dbInst = {
        };

        mongodbDep = {
            connect: sinon.stub().resolves(dbInst)
        };

        var pool = {
            Pool: function (obj) {
                /* Gets the object sent to the pool */
                Pool = obj;
            }
        };

        injector(function (_StoreError_) {
            StoreError = _StoreError_;
        });

        mongodb = proxyquire("../../../src/lib/driver", {
            "generic-pool": pool,
            mongodb: mongodbDep
        });

        expect(mongodb).to.have.key("__factory");
        expect(mongodb.__factory.name).to.be.equal("$mongodbDriver");

        mongodb = mongodb.__factory(StoreError);


    });

    describe("#create", function () {

        describe("configuration", function () {

            it("should call the Db with no config, returning a promise", function () {

                /* Invoke the factory */
                mongodb();

                return Pool.create()
                    .then(function (db) {

                        expect(mongodbDep.connect).to.be.calledOnce
                            .calledWithExactly("mongodb://localhost", {
                                promiseLibrary: bluebird
                            });

                        expect(db).to.be.equal(dbInst);

                    });

            });

            it("should call the Db with no config, returning a callback", function () {

                /* Invoke the factory */
                mongodb();

                return Pool.create(function (err, db) {

                    expect(mongodbDep.connect).to.be.calledOnce
                        .calledWithExactly("mongodb://localhost", {
                            promiseLibrary: bluebird
                        });

                    expect(err).to.be.null;
                    expect(db).to.be.equal(dbInst);

                });

            });

            it("should call the Db configured", function () {

                /* Invoke the factory */
                mongodb({
                    db: "dbname",
                    host: "localhost",
                    port: 27018
                });

                return Pool.create()
                    .then(function (db) {

                        expect(mongodbDep.connect).to.be.calledOnce
                            .calledWithExactly("mongodb://localhost:27018/dbname", {
                                promiseLibrary: bluebird
                            });

                        expect(db).to.be.equal(dbInst);

                    });

            });

        });

        describe("server setup", function () {

            it("should create a server with no username/password", function () {

                mongodb({
                    db: "dbname",
                    host: "localhost",
                    port: 27018
                });

                return Pool.create()
                    .then(function (db) {

                        expect(mongodbDep.connect).to.be.calledOnce
                            .calledWithExactly("mongodb://localhost:27018/dbname", {
                                promiseLibrary: bluebird
                            });

                        expect(db).to.be.equal(dbInst);

                    });

            });

            it("should fail to create a server with no username/password - promise", function () {

                mongodb({
                    db: "dbname",
                    host: "localhost",
                    port: 27018
                });

                mongodbDep.connect.rejects("error");

                return Pool.create()
                    .then(function () {
                        throw new Error("Should fail");
                    })
                    .catch(function (err) {

                        expect(mongodbDep.connect).to.be.calledOnce
                            .calledWithExactly("mongodb://localhost:27018/dbname", {
                                promiseLibrary: bluebird
                            });

                        expect(err).to.be.instanceof(StoreError);
                        expect(err.message).to.be.equal("error");

                    });

            });

            it("should fail to create a server with no username/password - callback", function () {

                mongodb({
                    db: "dbname",
                    host: "localhost",
                    port: 27018
                });

                mongodbDep.connect.rejects("error");

                return Pool.create(function (err, db) {

                    expect(mongodbDep.connect).to.be.calledOnce
                        .calledWithExactly("mongodb://localhost:27018/dbname", {
                            promiseLibrary: bluebird
                        });

                    expect(err).to.be.instanceof(StoreError);
                    expect(err.message).to.be.equal("error");

                    expect(db).to.be.undefined;

                });

            });

            it("should create a server with a username/password", function () {

                mongodb({
                    db: "dbname",
                    username: "user",
                    password: "pass",
                    host: "localhost",
                    port: 27018
                });

                return Pool.create()
                    .then(function (db) {

                        expect(mongodbDep.connect).to.be.calledOnce
                            .calledWithExactly("mongodb://user:pass@localhost:27018/dbname", {
                                promiseLibrary: bluebird
                            });

                        expect(db).to.be.equal(dbInst);

                    });

            });

            it("should create a server with a username/password and be unauthenticated", function () {

                mongodb({
                    db: "mydb",
                    username: "user1",
                    password: "pass1",
                    host: "192.168.99.100",
                    port: 32771
                });

                mongodbDep.connect.rejects("error");

                return Pool.create()
                    .then(function () {
                        throw new Error("Should fail");
                    })
                    .catch(function (err) {

                        expect(mongodbDep.connect).to.be.calledOnce
                            .calledWithExactly("mongodb://user1:pass1@192.168.99.100:32771/mydb", {
                                promiseLibrary: bluebird
                            });

                        expect(err).to.be.instanceof(StoreError);
                        expect(err.message).to.be.equal("error");

                    });

            });

        });

    });

    describe("#destroy", function () {

        it("should call the client close method", function () {

            var client = {
                close: sinon.spy()
            };

            mongodb({});

            expect(Pool.destroy(client)).to.be.undefined;

            expect(client.close).to.be.calledOnce
                .calledWithExactly();

        });

    });

    describe("pool config", function () {

        it("should not have any config set", function () {

            mongodb({});

            expect(Pool.name).to.be.equal("mongodb");
            expect(Pool.max).to.be.undefined;
            expect(Pool.min).to.be.undefined;
            expect(Pool.idleTimeoutMillis).to.be.undefined;
            expect(Pool.log).to.be.false;

        });

        it("should have the name set", function () {

            mongodb({
                name: "spikemilligan"
            });

            expect(Pool.name).to.be.equal("spikemilligan");

        });

        it("should have max connections set", function () {

            mongodb({
                maxConnections: 245
            });

            expect(Pool.max).to.be.equal(245);

        });

        it("should have min connections set", function () {

            mongodb({
                minConnections: 2
            });

            expect(Pool.min).to.be.equal(2);

        });

        it("should have timeout set", function () {

            mongodb({
                timeout: 3456000
            });

            expect(Pool.idleTimeoutMillis).to.be.equal(3456000);

        });

        it("should have log set", function () {

            mongodb({
                log: true
            });

            expect(Pool.log).to.be.true;

        });

        it("should allow a log function", function () {

            var fn = function () {};

            mongodb({
                log: fn
            });

            expect(Pool.log).to.be.equal(fn);

        });

    });

});
