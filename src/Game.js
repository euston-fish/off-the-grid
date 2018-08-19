import { gameSource, load } from '../tmp/wasm.js'

let SIZE = 1024;

/**
 * @constructor
 */
function Game() {
  let module = new WebAssembly.Module(gameSource);
  this.game = new WebAssembly.Instance(module, { 'env': { 'random': Math.random } });
  this.game.exports['init']();
  let memory = this.game.exports['memory'];
  this.address = this.game['exports']['address']();
  console.log('address: ' + this.address);
  this.terrain = new Uint8Array(memory.buffer, this.address, SIZE * SIZE);
  console.log(this.terrain[0]);
  this.water = new Uint8Array(memory.buffer, this.address + SIZE * SIZE, SIZE * SIZE);
  console.log(this.water[0]);
}

Game.prototype.tick = function() {
  this.game.then((result) => {
    result['instance'].exports['tick']();
  });
};

Game.prototype.getWater = function(x, y) {
  return this.water[x * SIZE + y];
}

Game.prototype.getTerrain = function(x, y) {
  return this.terrain[x * SIZE + y];
}

export default Game
