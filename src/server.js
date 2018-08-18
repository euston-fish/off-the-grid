import { normal } from './shared.js';
import Lens from './Lens.js';
import Block from './Block.js';

export default function() {
  const SIZE = 1024;
  console.log('creating terrain array');
  let terrain = Lens.arrayAccess(new Uint8Array(SIZE * SIZE), [SIZE, SIZE]);
  console.log('updating terrain');
  terrain.updateAll((_, [x, y]) => {
    console.log(x, y);
    return Math.min(x, 255);
    //Math.floor(normal(Math.random(), Math.random()) * 128)
  });

  let water = Lens.arrayAccess(new Uint8Array(SIZE * SIZE), [SIZE, SIZE]);
  water.updateAll(() => Math.floor(normal(Math.random(), Math.random()) * 128));

  console.log('creating blocks');
  let blocks = Array(1024 / 16).fill().map(
    (_, c) => Array(1024 / 16).fill().map(
      (_, r) => new Block([c, r], {
        terrain: terrain.window([c * 16, r * 16], [16, 16]),
        water: water.window([c * 16, r * 16], [16, 16])
      })
    )
  );
  console.log('done');

  return {
    'io': (socket) => {
      socket.on('disconnect', () => {
        console.log('Disconnected: ' + socket.id);
      });

      console.log('Connected: ' + socket.id);
    },

    'block/:col/:row': (req, res) => {
      res.json(blocks[parseInt(req['params']['col'])][parseInt(req['params']['row'])]);
    }
  };
}
