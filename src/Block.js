import Lens from './Lens.js';

// The idea is that a block will contain all the things in an NxN (currently 16x16) region
// For now, it just holds terrain
/**
 * @constructor
 */
function Block(coords, terrain) {
  this.coords = coords;
  this.terrain = terrain || Lens.arrayAccess(new Uint8Array(16 * 16), [16, 16]);
}

Block.worldToBlock = ([c, r]) => [Math.floor(c / 16), Math.floor(r / 16)];

Block.prototype.coordToWorld = function(coord) {
  return coord.add(this.coords.scale(16));
};

Block.prototype.coordFromWorld = function(coord) {
  return coord.sub(this.coords.scale(16));
};

Block.prototype.fromJSON = function({ 'terrain': terrain }) {
  this.terrain.fromJSON(terrain);
};

Block.prototype.toJSON = function() {
  return {
    'terrain': this.terrain.toJSON()
  };
};

export default Block;
