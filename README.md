# Steeplejack MongoDB

[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Dependencies][dependencies-image]][dependencies-url]
[![Dev Dependencies][dev-dependencies-image]][dev-dependencies-url]
[![License][license-image]][license-url]

MongoDB implementation for steeplejack projects

## Usage

This is a very thin wrapper for the MongoDB
[MongoClient.connect](http://mongodb.github.io/node-mongodb-native/2.1/api/MongoClient.html#.connect). It configures an
instance of the MongoDB driver wrapped in [generic-pool](https://github.com/coopernurse/node-pool) class for easy
connection pooling.

This configures a Steeplejack injectable module called `$mongodbDriver`.

```javascript
// Configure a factory dependency
export let __factory = {
    name: "$mongodbResource",
    factory: ($mongodbDriver) => {

        let poolOptions = {};
        let mongoOptions = {};
        let mongoUrl = "mongodb://localhost/db";

        return $mongodbDriver({
            url: mongoUrl,
            poolOptions,
            mongoOptions
        });

    }
};
```

The `poolOptions` accepts anything that the [generic-pool](https://github.com/coopernurse/node-pool#documentation)
takes.

The `mongoOptions` accepts anything that the
[MongoClient.connect options](http://mongodb.github.io/node-mongodb-native/2.1/api/MongoClient.html#.connect) take.

## Dependencies

This requires an object called `StoreError` to be registered to the Dependency Injector. You can either create your own
or use the [Steeplejack Errors](https://www.npmjs.com/package/steeplejack-errors) package


[node-version-image]: https://img.shields.io/badge/node.js-%3E%3D_0.10-brightgreen.svg?style=flat
[travis-image]: https://img.shields.io/travis/riggerthegeek/steeplejack-mongodb.svg?style=flat
[dependencies-image]: http://img.shields.io/david/riggerthegeek/steeplejack-mongodb.svg?style=flat
[dev-dependencies-image]: http://img.shields.io/david/dev/riggerthegeek/steeplejack-mongodb.svg?style=flat
[license-image]: http://img.shields.io/:license-MIT-green.svg?style=flat

[node-version-url]: http://nodejs.org/download/
[travis-url]: https://travis-ci.org/riggerthegeek/steeplejack-mongodb
[dependencies-url]: https://david-dm.org/riggerthegeek/steeplejack-mongodb
[dev-dependencies-url]: https://david-dm.org/riggerthegeek/steeplejack-mongodb#info=devDependencies&view=table
[license-url]: https://raw.githubusercontent.com/riggerthegeek/steeplejack-mongodb/master/LICENSE
