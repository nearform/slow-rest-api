'use strict'

var benchmark = require('benchmark')
var suite = new benchmark.Suite()

function sum (base, max) {
  var total = 0

  for (var i = base; i < max; i++) {
    total += i
  }
}

var sumBind = sum.bind(null, 0)

suite.add('sum bind', function smallSum () {
  var max = 65535

  sumBind(max)
})

suite.add('sum small', function smallSum () {
  var base = 0
  var max = 65535

  sum(base, max)
})

suite.add('from small to big', function bigSum () {
  var base = 32768
  var max = 98304

  sum(base, max)
})

suite.add('all big', function bigSum () {
  var base = 65536
  var max = 131071

  sum(base, max)
})

suite.on('complete', require('./print'))

suite.run()