/**
 * @constructor
 */
function Lens(get, set, keys) {
  this.get = get;
  this.set = set;
  this.keys = keys;
}

Lens.arrayAccess = function(data, size) {
  let multipliers = Array(size.length).fill(1);
  multipliers.forEach((_, i) => multipliers[i] *= (i === 0 ? 1 : size[i-1]));
  let coordToIndex = coord =>
    coord.zip(multipliers).map(([a, b]) => a * b).sum();
  return new Lens(
    (coord) => data[coordToIndex(coord)],
    (coord, val) => data[coordToIndex(coord)] = val,
    Array.cross(...size.map(s => Array(s).fill().iota()))
  );
};

// TODO: decide whether/how to bother checking bounds

Lens.prototype.update = function(coord, callback) {
  return this.set(coord, callback(this.get(coord)));
};

Lens.prototype.updateAll = function(callback) {
  for (let coord of this.keys) this.update(coord, callback);
};

Lens.prototype.offset = function(offset) {
  return new Lens(
    (coords) => this.get(coords.add(offset)),
    (coords, val) => this.set(coords.add(offset), val),
    this.keys // this is broken, but I'm not sure how (or if it's necessary) to fix it
  );
};

Lens.prototype.clip = function(predicate) {
  return new Lens(
    this.get,
    this.set,
    this.keys.filter(predicate)
  );
};

Lens.prototype.window = function(origin, size) {
  let w = this.offset(origin);
  w.keys = Array.cross(...size.map(s => Array(s).fill().iota()));
  return w;
};

Lens.prototype.toJSON = function() {
  let me = this;
  return this.keys.map(key => me.get(key));
};

Lens.prototype.fromJSON = function(json) {
  let me = this;
  this.keys.zip(json).forEach(([key, val]) => me.set(key, val));
};

export default Lens;
