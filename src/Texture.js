import Lens from './Lens.js';

/**
 * @constructor
 */
function Texture(size, values) {
  this.size = size;
  this.values = Uint8Array.from(values || Array(size[0] * size[1]));
  let me = this;
  this.lens = new Lens(
    coords => me.values[me.coordsToIndex(coords)],
    (coords, v) => me.values[me.coordsToIndex(coords)] = v,
    size
  );
}

Texture.prototype.coordsToIndex = function([col, row]) {
  return col * this.size[1] + row;
};

Texture.prototype.indexToCoords = function(index) {
  return [index % this.size[1], Math.floor(index / this.size[1])];
};

export default Texture;
