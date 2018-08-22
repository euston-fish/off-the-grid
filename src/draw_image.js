import { SIZE } from '../tmp/constants.js'; // TODO: work out how to make this nicer
import { fillTerrain } from './generate.js';
import draw from './draw.js';
import Block from './Block.js';
import Lens from './Lens.js';

let MockBlox = function(terrain, water) {
  let blocks = new Lens(new Array(SIZE * SIZE / 16 / 16), [SIZE / 16, SIZE / 16]);
  blocks.updateAll((_, [c, r]) => new Block([c, r], {
    terrain: terrain.window([c * 16, r * 16], [16, 16]),
    water: water.window([c * 16, r * 16], [16, 16]),
  }));
  this.blocks = blocks;
};

MockBlox.prototype.get = function(coord) {
  return this.blocks.get(coord);
};

export default () => {
  const can = require('canvas');
  const canvas = can.createCanvas(200, 200);
  const ctx = canvas.getContext('2d');
  let terrain = new Lens(new Uint8Array(SIZE * SIZE), [SIZE, SIZE]);
  fillTerrain(terrain);
  let water = new Lens(new Uint8Array(SIZE * SIZE), [SIZE, SIZE]);
  let manager = new MockBlox(terrain, water);

  draw(ctx, canvas, [0,0], [], manager);
  const fs = require('fs');
  const out = fs.createWriteStream('test.png');
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => console.log('The PNG file was created.'));
};