import { add, sub } from './shared.js';

/**
 * Provides access to a 2D region.
 * @constructor
 * @param {Lens~getter} getter
 * @param {Lens~setter} setter
 * @param {Lens~coordinate} size - The size of the region.
 */
function Lens(source, sourceSize, offset, size) {
  this.source = source;
  this.sourceSize = sourceSize;
  this.offset = offset || [0, 0];
  this.size = size || sub(sourceSize, this.offset);
}

/**
 * Updates a value in a Lens.
 * @callback Lens~update
 * @param value - The previous value.
 * @param {Lens~coordinate} coordinate - The coordinate of the value.
 * @returns The value to update with.
 */

/**
 * A coordinate in a Lens. Should have length 2.
 * @typedef {Array.<number>} Lens~coordinate
 */


// TODO: decide whether/how to bother checking bounds
/**
 * @function
 * @returns {Array.<Lens~coordinate>} An array of all the keys into the Lens.
 */
Lens.prototype.keys = function*() {
  for (let c = 0; c < this.size[0]; c++)
    for (let r = 0; r < this.size[1]; r++)
      yield [c, r];
};

let coordinateToIndex = function([c, r], [, h]) {
  return c * h + r;
};

/**
 * Gets the value at a coordinate within the Lens.
 * @function
 * @param {Lens~coordinate} coordinate - The coordinate to get. Wrapped if outside of [0, 0] to size.
 * @returns The value found at that coordinate
 */
Lens.prototype.get = function(coordinate) {
  if (coordinate[0] < 0 || coordinate[0] > this.size[0] || coordinate[1] < 0 || coordinate[1] > this.size[1]) return undefined;
  return this.source[coordinateToIndex(add(coordinate, this.offset), this.sourceSize)];
};

/**
 * Sets the value at a coordinate within the Lens.
 * @function
 * @param {Lens~coordinate} coordinate - The coordinate to set. Wrapped if outside of [0, 0] to size.
 * @param value - The value to set at that coordinate
 */
Lens.prototype.set = function(coordinate, value) {
  if (coordinate[0] < 0 || coordinate[0] > this.size[0] || coordinate[1] < 0 || coordinate[1] > this.size[1]) return;
  this.source[coordinateToIndex(add(coordinate, this.offset), this.sourceSize)] = value;
};

/**
 * @function
 * @param {Lens~coordinate} coordinate - The coordinate to update.
 * @param {Lens~update} callback - The callback used to update the value.
 */
Lens.prototype.update = function(coordinate, callback) {
  this.set(coordinate, callback(this.get(coordinate), coordinate));
};

/**
 * Note: no good if you're looking at a window
 * @function
 * @param {Lens~update} callback - The callback used to update values.
 */
Lens.prototype.updateAll = function(callback) {
  for (let key of this.keys()) this.update(key, callback);
};

/**
 * @function
 * @param {Lens~coordinate} offset - The offset to shift by.
 * @returns {Lens} A new Lens object, referring to the area from offset to [N, N] in the original.
 */
Lens.prototype.shift = function(offset) {
  return new Lens(this.source, this.sourceSize, add(this.offset, offset), sub(this.size, offset));
};

/**
 * @function
 * @param {Lens~coordinate} size - The size to shrink to.
 * @returns {Lens} A new Lens object, referring to the area from [0, 0] to size in the original.
 */
Lens.prototype.shrink = function(size) {
  return new Lens(this.source, this.sourceSize, this.offset, size);
};

/**
 * @function
 * @param {Lens~coordinate} origin - The origin of the window.
 * @param {Lens~coordinate} size - The size of the window.
 * @returns {Lens} A new Lens object, referring to the area from origin to size in the original.
 */
Lens.prototype.window = function(origin, size) {
  return this.shift(origin).shrink(size);
};

/**
 * @function
 * @returns {Array} The contents of the Lens in a format for JSON transmission.
 */
Lens.prototype.toJSON = function() {
  return Array.from(this.keys()).map(key => this.get(key));
};

/**
 * @function
 * @param {Array} json - The (already deserialised) object to convert back from.
 */
Lens.prototype.fromJSON = function(json) {
  // TODO: optimise
  Array.from(this.keys()).zip(json).forEach(([key, val]) => this.set(key, val));
};

export default Lens;
