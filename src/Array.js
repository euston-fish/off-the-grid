// TODO: work out how this behaves with lists of different lengths
Array.zip = function(...arrays) {
  return (arrays[0] || []).map((_, i) => arrays.map(array => array[i]));
};

Array.prototype.zip = function(...others) {
  return Array.zip(this, ...others);
};

Array.prototype.sum = function() {
  return this.reduce((acc, cur) => acc + cur, 0);
};

Array.prototype.product = function() {
  return this.reduce((acc, cur) => acc * cur, 1);
};

Array.prototype.add = function(...others) {
  return this.zip(...others).map(row => row.sum());
};

Array.prototype.inv = function() {
  return this.map(component => -component);
};

Array.prototype.sub = function(others) {
  return this.add(others.inv());
};

Array.prototype.scale = function(factor) {
  return this.map(component => component * factor);
};

Array.prototype.iota = function(begin) {
  begin = begin || 0;
  return this.map((_, i) => i + begin);
};

// TODO: maybe make this give an iterator
Array.prototype.cross = function(...others) {
  return Array.cross(this, ...others);
};

Array.prototype.flat = function() {
  return this.reduce((acc, val) => acc.concat(val), []);
};

Array.cross = function(first, ...others) {
  return first === undefined ?
    [[]] :
    first.map(component => Array.cross(...others).map(item => [component, ...item])).flat();
};

Array.prototype.swizzle = function(indices) {
  return indices.map(index => this[index]);
};

Array.prototype.chunk = function(n) {
  return Array(Math.ceil(this.length / n)).fill().map((_, i) => this.slice(i*n, i*n+n))
}
