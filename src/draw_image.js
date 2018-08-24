import { SIZE } from '../tmp/constants.js'; // TODO: work out how to make this nicer
import { fillTerrain } from './generate.js';
import draw from './draw.js';
import Lens from './Lens.js';

export default () => {
  const can = require('canvas');
  const canvas = can.createCanvas(200, 200);
  const ctx = canvas.getContext('2d');
  let terrain = new Lens(new Uint8Array(SIZE * SIZE), [SIZE, SIZE]);
  fillTerrain(terrain);
  let water = new Lens(new Uint8Array(SIZE * SIZE), [SIZE, SIZE]);

  draw(ctx, canvas, [0,0], [], terrain, water);
  const fs = require('fs');
  const out = fs.createWriteStream('test.png');
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => console.log('The PNG file was created.'));
};
