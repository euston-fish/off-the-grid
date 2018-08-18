/**
 * Provides access to a 2D region.
 * @constructor
 * @param {Lens~getter} getter
 * @param {Lens~setter} setter
 * @param {Lens~coordinate} size - The size of the region.
 */
function Lens(getter, setter, size) {
  this.getter = getter;
  this.setter = setter;
  this.size = size;
}

/**
 * Gets the value at a coordinate within the Lens.
 * @callback Lens~getter
 * @param {Lens~coordinate} coordinate - The coordinate to get. Guaranteed to be between [0, 0] and size.
 * @returns The value found at that coordinate
 */

/**
 * Sets the value at a coordinate within the Lens.
 * @callback Lens~setter
 * @param {Lens~coordinate} coordinate - The coordinate to set. Guaranteed to be between [0, 0] and size.
 * @param value - The value to set at that coordinate
 */

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
 * Gets the value at a coordinate within the Lens.
 * @function
 * @param {Lens~coordinate} coordinate - The coordinate to get. Wrapped if outside of [0, 0] to size.
 * @returns The value found at that coordinate
 */
Lens.prototype.get = function(coordinate) {
  return this.getter(Array.zip(coordinate, this.size).map(([x, s]) => x.mod(s)));
};

/**
 * Sets the value at a coordinate within the Lens.
 * @function
 * @param {Lens~coordinate} coordinate - The coordinate to set. Wrapped if outside of [0, 0] to size.
 * @param value - The value to set at that coordinate
 */
Lens.prototype.set = function(coordinate, value) {
  return this.setter(Array.zip(coordinate, this.size).map(([x, s]) => x.mod(s)), value);
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
 * @function
 * @param {Lens~update} callback - The callback used to update values.
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
    (coords) => this.get(coords),
    (coords) => this.set(coords),
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
  return this.keys().map(key => this.get(key));
};

/**
 * @function
 * @param {Array} json - The (already deserialised) object to convert back from.
 */
Lens.prototype.fromJSON = function(json) {
  this.keys().zip(json).forEach(([key, val]) => this.set(key, val));
};

export default Lens;
