
function MyClass (x) {
  this.x = x
}

function removeX (obj) {
  delete obj.x
  return obj
}

for (var i = 0; i < 100000; i++) {
  JSON.stringify(removeX(new MyClass(2)))
}
