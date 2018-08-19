import SIZE from './shared.js'
import makeTerrain from './generate.js'
import draw from './draw.js'
import Block from './Block.js'
import Lens from './Lens.js'

let MockBlox = function(terrain, water) {
  let blocks = Lens.arrayAccess(new Array(SIZE * SIZE / 16 / 16), [SIZE / 16, SIZE / 16]);
  blocks.updateAll((_, [c, r]) => new Block([c, r], {
    terrain: terrain.window([c * 16, r * 16], [16, 16]),
    water: terrain.window([c * 16, r * 16], [16, 16]),
  }));
  this.blocks = blocks;
}

MockBlox.prototype.get = function(coord) {
  return this.blocks.get(coord);
}

var PImage = require('pureimage');
let terrain = makeTerrain();
let water = Lens.arrayAccess(new Uint8Array(SIZE * SIZE), [SIZE, SIZE]);
let manager = MockBlox(terrain, water);

var canvas = PImage.make(100,100);
var ctx = canvas.getContext('2d');
draw(ctx, canvas, [0,0], [], manager);
