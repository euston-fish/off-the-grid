import Block from './Block.js';

/**
 * @constructor
 */
function BlockManager() {
  this.blocks = {};
  this.ages = {};
  this.fetching = {};
  this.eventTarget = new EventTarget();
}

BlockManager.prototype.get = function(coord) {
  if (this.blocks[coord] === undefined) this.blocks[coord] = new Block(coord);
  // If the (block doesn't exist or is older than 1 second) and isn't already being fetched
  if ((new Date()) - (this.ages[coord] || 0) > 1000 && !(coord in this.fetching)) {
    this.fetching[coord] = true;
    fetch(coord)
      .then(json => this.blocks[coord].fromJSON(json))
      .then(() => this.ages[coord] = new Date())
      .then(() => delete this.fetching[coord])
      .then(() => setTimeout(() => this.get(coord), 1050))
      .then(() => this.dispatchEvent(new Event('update', coord)));
  }
  return this.blocks[coord];
};

let fetch = function(coord) {
  return window.fetch(`block/${coord[0]}/${coord[1]}`)
    .then(res => res.json());
};

BlockManager.prototype.addEventListener = function(...args) {
  this.eventTarget.addEventListener(...args);
};

BlockManager.prototype.removeEventListener = function(...args) {
  this.eventTarget.removeEventListener(...args);
};

BlockManager.prototype.dispatchEvent = function(...args) {
  this.eventTarget.dispatchEvent(...args);
};

export default BlockManager;
