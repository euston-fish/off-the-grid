import { within, add, sub } from './shared.js';

/**
 * @constructor
 */
let LayerManager = function(baseUrl) {
  this.baseUrl = baseUrl;
  this.origin = [0, 0];
  this.size = [0, 0];
  this.data = [];
};

let coordToIndex = ([c, r], [, h]) => c * h + r;

LayerManager.prototype.get = function(coordinate) {
  return this.data[coordToIndex(sub(coordinate, this.origin), this.size)];
};

LayerManager.prototype.incorporateData = function(data, origin, size) {
  for (let c = 0; c < size[0]; c++) {
    for (let r = 0; r < size[1]; r++) {
      let oldSpaceCoord = [c, r];
      let worldCoord = add(oldSpaceCoord, origin);
      let newSpaceCoord = sub(worldCoord, this.origin);

      if (within(newSpaceCoord, [0, 0], this.size)) {
        this.data[coordToIndex(newSpaceCoord, this.size)] = data[coordToIndex(oldSpaceCoord, size)];
      }
    }
  }
};

LayerManager.prototype.setRegion = function(origin, size) {
  let oldData = this.data;
  let oldOrigin = this.origin;
  let oldSize = this.size;
  this.data = Array(size[0] * size[1]).fill();
  this.origin = origin;
  this.size = size;

  this.incorporateData(oldData, oldOrigin, oldSize);
};

LayerManager.prototype.update = function(origin, size) {
  origin = origin || this.origin;
  size = size || this.size;
  return fetch(`${this.baseUrl}/${origin[0]}/${origin[1]}/${size[0]}/${size[1]}/`)
    .then(response => response.json())
    .then(data => this.incorporateData(data, origin, size));
};

export default LayerManager;
