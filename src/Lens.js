/**
 * Provides access to a 2D region.
 * @constructor
 * @param {Lens~getter} get
 * @param {Lens~setter} set
 * @param {Lens~coordinate} size - The size of the region.
 */
function Lens(get, set, size) {
  this.get = get;
  this.set = set;
  this.size = size;
}

/**
 * Gets the value at a coordinate within the Lens.
 * @callback Lens~getter
 * @param {Lens~coordinate} coordinate - The coordinate to get.
 * @returns The value found at that coordinate
 */

/**
 * Sets the value at a coordinate within the Lens.
 * @callback Lens~setter
 * @param {Lens~coordinate} coordinate - The coordinate to set.
 * @param value - The value to set at that coordinate
 */

/**
 * A coordinate in a Lens. Should have length 2.
 * @typedef {Array.<number>} Lens~coordinate
 */

/**
 * @function
 * @param {Array|TypedArray} data - The array to access.
 * @param {Lens~coordinate} size - The size to interpret.
 * @returns {Lens} A new Lens object.
 */
Lens.arrayAccess = function(data, size) {
  let coordToIndex = ([c, r]) => c * size[1] + r;
  return new Lens(
    (coord) => data[coordToIndex(coord)],
    (coord, val) => data[coordToIndex(coord)] = val,
    size
  );
};

// TODO: decide whether/how to bother checking bounds
/**
 * @function
 * @returns {Array.<Lens~coordinate>} An array of all the keys into the Lens.
 */
Lens.prototype.keys = function() {
  // TODO: maybe make this an iterator
  return Array.cross(...this.size.map(s => Array(s).fill().iota()));
};

/**
 * @function
 * @param {Lens~coordinate} coordinate - The coordinate to update.
 * @param {function(*, *)} callback - The callback used to update the value.
 */
Lens.prototype.update = function(coordinate, callback) {
  this.set(coordinate, callback(this.get(coordinate), coordinate));
};

/**
 * @function
 * @param {function(*, *)} callback - The callback used to update values.
 */
Lens.prototype.updateAll = function(callback) {
  this.keys().forEach(coordinate => this.update(coordinate, callback));
};

/**
 * @function
 * @param {Lens~coordinate} offset - The offset to shift by.
 * @returns {Lens} A new Lens object, referring to the area from offset to [N, N] in the original.
 */
Lens.prototype.offset = function(offset) {
  return new Lens(
    (coords) => this.get(coords.add(offset)),
    (coords, val) => this.set(coords.add(offset), val),
    this.size.sub(offset)
  );
};

/**
 * @function
 * @param {Lens~coordinate} size - The size to shrink to.
 * @returns {Lens} A new Lens object, referring to the area from [0, 0] to size in the original.
 */
Lens.prototype.shrink = function(size) {
  return new Lens(
    this.get,
    this.set,
    size
  );
};

/**
 * @function
 * @param {Lens~coordinate} origin - The origin of the window.
 * @param {Lens~coordinate} size - The size of the window.
 * @returns {Lens} A new Lens object, referring to the area from origin to size in the original.
 */
Lens.prototype.window = function(origin, size) {
  return this.offset(origin).shrink(size);
};

/**
 * @function
 * @returns {Array} The contents of the Lens in a format for JSON transmission.
 */
Lens.prototype.toJSON = function() {
  let me = this;
  return this.keys().map(key => me.get(key));
};

/**
 * @function
 * @param {Array} json - The (already deserialised) object to convert back from.
 */
Lens.prototype.fromJSON = function(json) {
  let me = this;
  this.keys().zip(json).forEach(([key, val]) => me.set(key, val));
};

export default Lens;
