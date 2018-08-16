import { normal } from './shared.js';

const SIZE = 256;
let terrain = new Uint8Array(SIZE * SIZE);
terrain.forEach((_, i) => terrain[i] = Math.floor(normal(Math.random(), Math.random()) * 128));

export default {
  'io': (socket) => {
    socket.on('disconnect', () => {
      console.log('Disconnected: ' + socket.id);
    });

    console.log('Connected: ' + socket.id);
  },

  'terrain': (req, res) => {
    res.json(Array.from(terrain));
  }
};

