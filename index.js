'use strict'

const etag = require('./etag')
const pkg = JSON.stringify(require('./package.json'))

const restify = require('restify')
const server = restify.createServer()
let count = 1

function payload () {
  const data = {
    a: Date.now() * Math.random(),
    b: Date.now() * Math.random(),
    c: Date.now() * Math.random(),
    d: Date.now() * Math.random(),
    e: Date.now() * Math.random(),
    f: Date.now() * Math.random(),
    g: Date.now() * Math.random(),
    h: Date.now() * Math.random()
  }

  delete data.d
  var val= 1

  for (var i = 0; i < 100; i++) {
    val += data.g
  }

  return '' + val
}

server.get('/a', function a (req, res, next) {
  const tag = etag(pkg + ++count)

  if (!(tag instanceof Error)) {
    res.setHeader('ETag', tag)
  }

  res.send(payload())
  return next()
})

server.get('/b', function b (req, res, next) {
  const tag = etag({entity: pkg + ++count, algorithm: 'sha256'})

  if (!(tag instanceof Error)) {
    res.setHeader('ETag', tag)
  }

  res.send(payload())
  return next()
})

server.get('/c', function c (req, res, next) {
  const tag = etag(pkg + ++count, {algorithm: 'sha512WithRsaEncryption'})

  if (!(tag instanceof Error)) {
    res.setHeader('ETag', tag)
  }

  res.send(payload())
  return next()
})

server.listen(3000)
