import { normal } from './shared.js';
import Texture from './Texture.js';
import Block from './Block.js';

let inspect = (x) => { console.log(x); return x; };

const SIZE = 1024;
let terrain = new Texture([SIZE, SIZE]);
terrain.lens.updateAll(() => Math.floor(normal(Math.random(), Math.random()) * 128));
let blocks = Array(1024 / 16).fill().map(
  (_, c) => Array(1024 / 16).fill().map(
    (_, r) => new Block([c, r], terrain.lens.subLens([c * 16, r * 16], [16, 16]))
  )
)


export default {
  'io': (socket) => {
    socket.on('disconnect', () => {
      console.log('Disconnected: ' + socket.id);
    });

    console.log('Connected: ' + socket.id);
  },

  'terrain': (req, res) => {
    res.json(Array.from(terrain.values));
  },

  'block/:col/:row': (req, res) => {
    res.json(blocks[req['params']['col']][req['params']['row']])
  }
};

