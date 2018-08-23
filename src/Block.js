import Lens from './Lens.js';

// The idea is that a block will contain all the things in an NxN (currently 16x16) region
// For now, it just holds terrain
/**
 * @constructor
 */
function Block(coords, block) {
  this.coords = coords;
  let { terrain, water } = block || {};
  this.terrain = terrain || new Lens(new Float32Array(16 * 16), [16, 16]);
  this.water = water || new Lens(new Float32Array(16 * 16), [16, 16]);
}

Block.worldToBlock = ([c, r]) => [Math.floor(c / 16), Math.floor(r / 16)];

Block.prototype.coordToWorld = function(coord) {
  return coord.add(this.coords.scale(16));
};

Block.prototype.coordFromWorld = function(coord) {
  return coord.sub(this.coords.scale(16));
};

Block.prototype.fromJSON = function({ 'terrain': terrain, 'water': water }) {
  this.terrain.fromJSON(terrain);
  this.water.fromJSON(water);
};

Block.prototype.toJSON = function() {
  return {
    'terrain': this.terrain.toJSON(),
    'water': this.water.toJSON()
  };
};

export default Block;
