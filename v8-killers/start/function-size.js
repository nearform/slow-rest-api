'use strict'

function sum (base, max) {
  // Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  // Vestibulum vel interdum odio. Curabitur euismod lacinia ipsum non congue.
  // Suspendisse vitae rutrum massa. Class aptent taciti sociosqu ad litora torquent
  // per conubia nostra, per inceptos himenaeos. Morbi mattis quam ut erat vestibulum,
  // at laoreet magna pharetra. Cras quis augue suscipit, pulvinar dolor a, mollis est.
  // Suspendisse potenti. Pellentesque egestas finibus pulvinar.
  // Vestibulum eu rhoncus ante, id viverra eros. Nunc eget tempus augue.

  var total = 0

  for (var i = base; i < max; i++) {
    total += i
  }
}

function wrap () {
  sum(0, 65535)
}

for (var i = 0; i < 10000; i++) {
  wrap()
}
