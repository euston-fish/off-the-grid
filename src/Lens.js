import { sub } from './shared.js';

/**
 * @constructor
 */
function Lens(get, set, size) {
  this.get = get;
  this.set = set;
  this.size = size;
}

// TODO: decide whether/how to bother checking width and height

Lens.prototype.keys = function*() {
  for (let col = 0; col < this.size[0]; col++)
    for (let row = 0; row < this.size[1]; row++)
      yield [col, row];
};

Lens.prototype.update = function(coord, callback) {
  return this.set(coord, callback(this.get(coord)));
};

Lens.prototype.updateAll = function(callback) {
  for (let coord of this.keys()) this.update(coord, callback);
};

Lens.prototype.subLens = function(origin, size) {
  return new Lens(
    (coords) => this.get(sub(coords, origin)),
    (coords, val) => this.set(sub(coords, origin), val),
    size
  );
};

Lens.prototype.toJSON = function() {
  let me = this;
  return Array(me.size[0]).fill().map(
    (_, c) => Array(me.size[1]).fill().map((_, r) => me.get([c, r]))
  );
};

Lens.prototype.fromJSON = function(json) {
  let me = this;
  json.forEach((column, col) =>
    column.forEach((val, row) =>
      me.set([col, row], val)));
};

export default Lens;
