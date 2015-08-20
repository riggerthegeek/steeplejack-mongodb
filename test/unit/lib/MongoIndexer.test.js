/**
 * Mongo Indexer
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


describe("mongoIndexer test", function () {

    var db,
        ensureIndex,
        cb,
        mongoIndexer;
    beforeEach(function () {

        ensureIndex = sinon.stub();

        db = {
            collection: sinon.stub().returns({
                ensureIndex: ensureIndex
            })
        };

        cb = sinon.spy();

        injector(function (_$mongoIndexer_) {
            mongoIndexer = _$mongoIndexer_;
        });

    });

    describe("object", function () {

        it("should handle an error", function () {

            ensureIndex.yields("err");

            var index = {
                col1: 1,
                col2: 1,
                col3: 1
            };

            mongoIndexer(db, index, "sometable", cb);

            expect(db.collection).to.be.calledOnce
                .calledWith("sometable");

            expect(ensureIndex).to.be.calledOnce
                .calledWith(index, {
                    background: true,
                    name: "col1-col2-col3",
                    w: 1
                });

            expect(cb).to.be.calledOnce
                .calledWithExactly("err");

        });

        it("should receive an object of indexes", function () {

            ensureIndex.yields(null, "result");

            var index = {
                col1: 1,
                col2: 1,
                col3: 1
            };

            mongoIndexer(db, index, "sometable", cb);

            expect(db.collection).to.be.calledOnce
                .calledWith("sometable");

            expect(ensureIndex).to.be.calledOnce
                .calledWith(index, {
                    background: true,
                    name: "col1-col2-col3",
                    w: 1
                });

            expect(cb).to.be.calledOnce
                .calledWithExactly(null, "result");

        });

    });

    describe("array of objects", function () {

        it("should handle an error", function () {

            ensureIndex.yields("err");

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

            mongoIndexer(db, indexes, "someothertable", cb);

            expect(db.collection).to.be.calledOnce
                .calledWith("someothertable");

            expect(ensureIndex).to.be.calledOnce
                .calledWith(indexes[0], {
                    background: true,
                    name: "col1-col2-col3",
                    w: 1
                });

            expect(cb).to.be.calledOnce
                .calledWithExactly("err");

        });

        it("should be successful", function (done) {

            ensureIndex.yields(null, "result");

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

            mongoIndexer(db, indexes, "someothertable", function (err, result) {

                expect(cb).to.not.be.called;

                expect(db.collection).to.be.calledThrice
                    .calledWith("someothertable");

                expect(ensureIndex).to.be.calledThrice
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

                expect(err).to.be.null;
                expect(result).to.be.eql([
                    "result",
                    "result",
                    "result"
                ]);

                done();

            });

        });

    });

});
