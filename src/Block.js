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
  if (eval('typeof window') !== 'undefined') this.eventTarget = new EventTarget();
  this.fetching = false;
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
  this.eventTarget.dispatchEvent(new Event('update'));
};

Block.prototype.toJSON = function() {
  return {
    'terrain': this.terrain.toJSON()
  };
};

// Maybe move fetch and the events into BlockManager?
Block.prototype.fetch = function() {
  let me = this;
  if (me.fetching === false) {
    me.fetching = true;
    fetch(`block/${this.coords[0]}/${this.coords[1]}`)
      .then(res => res.json())
      .then((json) => me.fromJSON(json))
      .finally(() => me.fetching = false);
  }
};

Block.prototype.addEventListener = function(...args) {
  this.eventTarget.addEventListener(...args);
};

Block.prototype.removeEventListener = function(...args) {
  this.eventTarget.removeEventListener(...args);
};

Block.prototype.dispatchEvent = function(...args) {
  this.eventTarget.dispatchEvent(...args);
};

export default Block;
