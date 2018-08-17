import { add, sub, scale } from './shared.js';
import Texture from './Texture.js';

// The idea is that a block will contain all the things in an NxN (currently 16x16) region
// For now, it just holds terrain
/**
 * @constructor
 */
function Block(coords, terrain) {
  this.coords = coords;
  this.terrain = terrain || (new Texture([16, 16])).lens;
}

Block.worldToBlock = ([c, r]) => [Math.floor(c / 16), Math.floor(r / 16)];

Block.prototype.coordToWorld = function(coord) {
  return add(coord, scale(this.coords, 16));
};

Block.prototype.coordFromWorld = function(coord) {
  return sub(coord, scale(this.coords, 16));
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
