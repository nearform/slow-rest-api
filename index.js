'use strict'

var etag = require('./etag')
var pkg = JSON.stringify(require('./package.json'))

var statsToElastic = require('@nearform/stats-to-elasticsearch')
statsToElastic({host: "elasticsearch:9200"}, {tags: ['slow-rest-api']}).start()

var restify = require('restify')
var server = restify.createServer()
var count = 1

server.get('/a', function (req, res, next) {
  var tag = etag(pkg + ++count)

  if (!(tag instanceof Error)) {
    res.setHeader('ETag', tag)
  }

  res.send(pkg)
  return next()
})

server.get('/b', function (req, res, next) {
  var tag = etag({entity: pkg + ++count, algorithm: 'sha256'})

  if (!(tag instanceof Error)) {
    res.setHeader('ETag', tag)
  }

  res.send(pkg)
  return next()
})

server.get('/c', function (req, res, next) {
  var tag = etag(pkg + ++count, {algorithm: 'sha512WithRsaEncryption'})

  if (!(tag instanceof Error)) {
    res.setHeader('ETag', tag)
  }

  res.send(pkg)
  return next()
})

server.listen(process.env.PORT || 3000)

var signal = 'SIGINT'

// Cleanly shut down process on SIGINT to ensure that perf-<pid>.map gets flushed
process.on(signal, onSignal)

function onSignal () {
  console.error('count', count)
  // IMPORTANT to log on stderr, to not clutter stdout which is purely for data, i.e. dtrace stacks
  console.error('Caught', signal, ', shutting down.')
  server.close()
  process.exit(0)
}
