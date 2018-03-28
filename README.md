# slow-rest-api

A REST API that is slow.

Part of the __The Node.js Performance Workshop__.

## Steps

1. clone this repository
2. `npm install`
3. `node index`
4. In another terminal: `npm test`

## Running Clinic Doctor

1. Install [clinic](http://npm.im/clinic) with `npm install clinic -g`
2. Run `clinic doctor -- node index`
3. What is the problem?

A sample doctor output is included in `doctor.html`.

## Generating a flamegraph

1. Make sure you are on Linux or Mac OS X, and you have superuser
   permissions
2. Install [clinic](http://npm.im/clinic) with `npm install clinic -g`
3. `clinic flame -- node index`
4. In another terminal, as soon as possible: `npm test`
5. CTRL-C the `clinic` process.

A sample flamegraph is included in `flamegraph.html`.

## License

MIT
