/**
 * Mongo Indexer
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


describe("mongoIndexer test", function () {

    var db,
        createIndex,
        mongoIndexer;
    beforeEach(function () {

        createIndex = sinon.stub();

        db = {
            collection: sinon.stub().returns({
                createIndex: createIndex
            })
        };

        injector(function (_$mongoIndexer_) {
            mongoIndexer = _$mongoIndexer_;
        });

    });

    describe("object", function () {

        it("should handle an error", function () {

            createIndex.rejects("err");

            var index = {
                col1: 1,
                col2: 1,
                col3: 1
            };

            expect(mongoIndexer(db, index, "sometable")).to.be.eventually.rejectedWith("err");

            expect(db.collection).to.be.calledOnce
                .calledWith("sometable");

            expect(createIndex).to.be.calledOnce
                .calledWith(index, {
                    background: true,
                    name: "col1-col2-col3",
                    w: 1
                });

        });

        it("should receive an object of indexes", function () {

            createIndex.resolves("result");

            var index = {
                col1: 1,
                col2: 1,
                col3: 1
            };

            mongoIndexer(db, index, "sometable");

            expect(db.collection).to.be.calledOnce
                .calledWith("sometable");

            expect(createIndex).to.be.calledOnce
                .calledWith(index, {
                    background: true,
                    name: "col1-col2-col3",
                    w: 1
                });

        });

    });

    describe("array of objects", function () {

        it("should handle an error", function (done) {

            createIndex.rejects("err");

            var indexes = [{
                col1: 1,
                col2: 1,
                col3: 1
            }, {
                col3: 1,
                col2: 1
            }, {
                col5: 1
            }];

            mongoIndexer(db, indexes, "someothertable")
                .catch(function (err) {

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal("err");

                    expect(db.collection).to.be.calledOnce
                        .calledWith("someothertable");

                    expect(createIndex).to.be.calledOnce
                        .calledWithExactly(indexes[0], {
                            background: true,
                            name: "col1-col2-col3",
                            w: 1
                        });

                    done();

                });

        });

        it("should be successful", function (done) {

            createIndex.resolves("result");

            var indexes = [{
                col1: 1,
                col2: 1,
                col3: 1
            }, {
                col3: 1,
                col2: 1
            }, {
                col5: 1
            }];

            mongoIndexer(db, indexes, "someothertable")
                .then(function (arr) {

                    expect(arr).to.be.eql([
                        "result",
                        "result",
                        "result"
                    ]);

                    expect(db.collection).to.be.calledThrice
                        .calledWith("someothertable");

                    expect(createIndex).to.be.calledThrice
                        .calledWith(indexes[0], {
                            background: true,
                            name: "col1-col2-col3",
                            w: 1
                        })
                        .calledWith(indexes[1], {
                            background: true,
                            name: "col3-col2",
                            w: 1
                        })
                        .calledWith(indexes[2], {
                            background: true,
                            name: "col5",
                            w: 1
                        });

                    done();

                });

        });

    });

});
