import { gameSource } from '../tmp/wasm.js';
import Lens from './Lens.js';

let SIZE = 1024;

/**
 * @constructor
 */
function Game() {
  let module = new WebAssembly.Module(gameSource);
  this.game = new WebAssembly.Instance(module, { 'env': { 'random': Math.random, 'log': (x) => console.log('from rust with love: ' + x)  } });
  this.game.exports['init']();
  let memory = this.game.exports['memory'];
  this.address = this.game.exports['address']();
  console.log('address: ' + this.address);
  this.terrain = new Lens(new Uint8Array(memory.buffer, this.address, SIZE * SIZE), [SIZE, SIZE]);
  this.water = new Lens(new Uint8Array(memory.buffer, this.address + SIZE * SIZE, SIZE * SIZE), [SIZE, SIZE]);
}

Game.prototype.tick = function() {
  this.game.exports['tick']();
};

Game.prototype.getWater = function(x, y) {
  return this.water[x * SIZE + y];
};

Game.prototype.setWater = function(x, y, v) {
  this.water[x * SIZE + y] = v;
}

Game.prototype.getTerrain = function(x, y) {
  return this.terrain[x * SIZE + y];
};

Game.prototype.setTerrain = function(x, y, v) {
  this.terrain[x * SIZE + y] = v;
}

export default Game;
