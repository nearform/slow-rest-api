'use strict'

const os = require('os')
const autocannon = require('autocannon')
const { PassThrough } = require('stream')

function run (url) {
  const buf = []
  const outputStream = new PassThrough()

  const inst = autocannon({
    url,
    connections: 100,
    duration: 20
  })

  autocannon.track(inst, { outputStream })

  outputStream.on('data', data => buf.push(data))
  inst.on('done', function () {
    process.stdout.write(os.EOL)
    process.stdout.write(Buffer.concat(buf))
  })
}

console.log('Running all benchmarks in parallel ...')

// We use multiple autocannon instances so we get
// output for each of them to see which one is faster.
// If we are just profiling the server as a whole a single
// instance could be used instead.

run('http://localhost:3000/a')
run('http://localhost:3000/b')
run('http://localhost:3000/c')

