/**
 * @constructor
 */
function Lens(get, set, size) {
  this.get = get;
  this.set = set;
  this.size = size;
}

Lens.arrayAccess = function(data, size) {
  let coordToIndex = ([c, r]) => c * size[1] + r;
  return new Lens(
    (coord) => data[coordToIndex(coord)],
    (coord, val) => data[coordToIndex(coord)] = val,
    size
  );
};

// TODO: decide whether/how to bother checking bounds
Lens.prototype.keys = function() {
  // TODO: maybe make this an iterator
  return Array.cross(...this.size.map(s => Array(s).fill().iota()));
};

Lens.prototype.update = function(coord, callback) {
  return this.set(coord, callback(this.get(coord)));
};

Lens.prototype.updateAll = function(callback) {
  for (let coord of this.keys()) this.update(coord, callback);
};

Lens.prototype.offset = function(offset) {
  return new Lens(
    (coords) => this.get(coords.add(offset)),
    (coords, val) => this.set(coords.add(offset), val),
    this.size.sub(offset)
  );
};

Lens.prototype.shrink = function(size) {
  return new Lens(
    this.get,
    this.set,
    size
  );
};

Lens.prototype.window = function(origin, size) {
  return this.offset(origin).shrink(size);
};

Lens.prototype.toJSON = function() {
  let me = this;
  return this.keys().map(key => me.get(key));
};

Lens.prototype.fromJSON = function(json) {
  let me = this;
  this.keys().zip(json).forEach(([key, val]) => me.set(key, val));
};

export default Lens;
