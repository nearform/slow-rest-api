# slow-rest-api

A REST API that is slow.

Part of the workshop __Optimizing Node.js applications with 0x and autocannon__

## Steps

1. clone this repository
2. `npm install`
3. `node index`
4. In another terminal: `npm test`

## Generating a flamegraph

1. Make sure you are on Linux or Mac OS X, and you have superuser
   permissions
2. Install [0x](http://npm.im/0x) with `npm install 0x -g`
3. `0x index`
4. In another terminal, as soon as possible: `npm test`
5. CTRL-C the `0x` process.

A sample flamegraph is included in `flamegraph.html`.

## V8 microbenchmarks

The v8-microbenchmarks folder contains some examples of V8 killers.

Run them and be surprised!

## License

MIT
