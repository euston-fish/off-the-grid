import { gameSource } from '../tmp/game.js';
import Lens from './Lens.js';
import { SIZE } from '../tmp/constants.js';

/**
 * @constructor
 */
function Game() {
  let module = new WebAssembly.Module(gameSource);
  this.game = new WebAssembly.Instance(module, {
    'env': {
      'random': Math.random,
      'log': (x) => console.log('from rust with love: ' + x),
      'logf': (x) => console.log('from rust with love: ' + x),
    }
  });
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

export default Game;
