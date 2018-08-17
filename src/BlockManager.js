import Block from './Block.js';

/**
 * @constructor
 */
function BlockManager() {
  this.blocks = {};
}

BlockManager.prototype.get = function(coord) {
  if (this.blocks[coord] === undefined) this.blocks[coord] = new Block(coord);
  this.blocks[coord].fetch();
  return this.blocks[coord];
};

export default BlockManager;
