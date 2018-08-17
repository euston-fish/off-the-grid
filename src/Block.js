import Texture from './Texture.js'

/**
 * @constructor
 */
function Block(coords, terrain) {
  this.coords = coords;
  this.terrain = terrain || (new Texture(16, 16)).lens;
  if (eval('typeof window') !== 'undefined') this.eventTarget = new EventTarget();
  this.fetching = false;
;}

Block.prototype.fromJSON = function({ 'terrain': terrain }) {
  this.terrain.fromJSON(terrain);
  this.dispatchEvent({ type: 'update' });
}

Block.prototype.toJSON = function() {
  return {
    'terrain': this.terrain.toJSON()
  }
}

Block.prototype.fetch = function() {
  let me = this;
  if (me.fetching === false) {
    me.fetching = true;
    fetch(`block/${this.coords[0]}/${this.coords[1]}`)
      .then(res => res.json())
      .then((json) => me.fromJSON(json))
      .finally(() => me.fetching = false)
  }
}

Block.prototype.addEventListener = function(...args) {
  this.eventTarget.addEventListener(...args)
};

Block.prototype.removeEventListener = function(...args) {
  this.eventTarget.removeEventListener(...args)
};

Block.prototype.dispatchEvent = function(...args) {
  this.eventTarget.dispatchEvent(...args)
};

export default Block;
