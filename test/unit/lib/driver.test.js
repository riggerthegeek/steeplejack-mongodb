/**
 * mongodb
 */

"use strict";


/* Node modules */


/* Third-party modules */
var proxyquire = require("proxyquire");


/* Files */


describe("mongodb test", function () {

    var mongodb, mongodbDep, dbInst, Pool, StoreError;
    beforeEach(function () {

        dbInst = {
            open: sinon.stub(),
            authenticate: sinon.stub()
        };

        mongodbDep = {
            Db: sinon.stub().returns(dbInst),
            Server: sinon.stub()
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

            it("should call the Db and Server with no config", function () {

                /* Invoke the factory */
                mongodb({});

                var obj = Pool.create();

                expect(obj).to.be.undefined;

                expect(mongodbDep.Server).to.be.calledOnce
                    .calledWith(undefined, undefined);

                expect(mongodbDep.Db).to.be.calledOnce
                    .calledWith(undefined, {}, {
                        w: 1
                    });

            });

            it("should call the Db and Server configured", function () {

                mongodb({
                    db: "dbname",
                    host: "localhost",
                    port: 27018
                });

                var obj = Pool.create();

                expect(obj).to.be.undefined;

                expect(mongodbDep.Server).to.be.calledOnce
                    .calledWithNew
                    .calledWith("localhost", 27018);

                expect(mongodbDep.Db).to.be.calledOnce
                    .calledWith("dbname", {}, {
                        w: 1
                    });

            });

        });

        describe("server setup", function () {

            it("should create a server with no username/password", function (done) {

                dbInst.open.yields(null, dbInst);

                mongodb({
                    db: "dbname",
                    host: "localhost",
                    port: 27018
                });

                Pool.create(function (err, db) {

                    expect(err).to.be.null;
                    expect(db).to.be.equal(dbInst);

                    expect(dbInst.open).to.be.calledOnce;

                    done();

                });

            });

            it("should fail to create a server with no username/password", function (done) {

                dbInst.open.yields(new Error("error"), null);

                mongodb({
                    db: "dbname",
                    host: "localhost",
                    port: 27018
                });

                Pool.create(function (err, db) {

                    expect(err).to.be.instanceof(StoreError);
                    expect(err.message).to.be.equal("error");

                    expect(db).to.be.null;

                    expect(dbInst.open).to.be.calledOnce;

                    done();

                });

            });

            it("should create a server with a username/password", function (done) {

                dbInst.open.yields(null, dbInst);
                dbInst.authenticate.yields(null, true);

                mongodb({
                    db: "dbname",
                    username: "user",
                    password: "pass",
                    host: "localhost",
                    port: 27018
                });

                Pool.create(function (err, db) {

                    expect(err).to.be.null;
                    expect(db).to.be.equal(dbInst);

                    expect(dbInst.open).to.be.calledOnce;

                    expect(dbInst.authenticate).to.be.calledOnce
                        .calledWith("user", "pass");

                    done();

                });

            });

            it("should create a server with a username/password and be unauthenticated", function (done) {

                dbInst.open.yields(null, dbInst);
                dbInst.authenticate.yields(null, false);

                mongodb({
                    db: "dbname",
                    username: "user",
                    password: "pass",
                    host: "localhost",
                    port: 27018
                });

                Pool.create(function (err, db) {

                    expect(err).to.be.instanceof(StoreError);
                    expect(err.message).to.be.equal("Cannot authenticate the MongoDB");

                    expect(db).to.be.null;

                    expect(dbInst.open).to.be.calledOnce;

                    expect(dbInst.authenticate).to.be.calledOnce
                        .calledWith("user", "pass");

                    done();

                });

            });

            it("should fail to create a server with a username/password", function (done) {

                dbInst.open.yields(null, dbInst);
                dbInst.authenticate.yields(new Error("message"), null);

                mongodb({
                    db: "dbname",
                    username: "user",
                    password: "pass",
                    host: "localhost",
                    port: 27018
                });

                Pool.create(function (err, db) {

                    expect(err).to.be.instanceof(StoreError);
                    expect(err.message).to.be.equal("message");

                    expect(db).to.be.null;

                    expect(dbInst.open).to.be.calledOnce;

                    expect(dbInst.authenticate).to.be.calledOnce
                        .calledWith("user", "pass");

                    done();

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
