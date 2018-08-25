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
      'powf': Math.pow
    }
  });
  this.game.exports['init']();
  let memory = this.game.exports['memory'];
  this.address = this.game.exports['address']();
  console.log('address: ' + this.address);
  this.terrain = new Lens(new Float32Array(memory.buffer, this.address, SIZE * SIZE), [SIZE, SIZE]);
  this.water = new Lens(new Float32Array(memory.buffer, this.address + SIZE * SIZE * 4, SIZE * SIZE), [SIZE, SIZE]);
}

Game.prototype.tick = function() {
  this.game.exports['tick']();
};

Game.prototype.addInstruction = function(instruction) {
  this.game.exports['add_instruction'](instruction.code, instruction.impact);
};

export default Game;
