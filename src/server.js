import { normal } from './shared.js';
import Texture from './Texture.js';

let inspect = (x) => { console.log(x); return x; };

const SIZE = 64;
let terrain = new Texture([SIZE, SIZE]);
terrain.lens.updateAll(() => inspect(Math.floor(normal(Math.random(), Math.random()) * 128)));


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

  'terrain/:col/:row': (req, res) => {
    res.json(terrain.lens.subLens([req['params']['col'], req['params']['row']], [16, 16]));
  }
};

