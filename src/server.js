import { SIZE } from './shared.js';
import { fillTerrain, fillWater } from './generate.js';
import Lens from './Lens.js';
import Block from './Block.js';
import Game from './Game.js';

export default function() {
  let game = new Game();

  let terrain = game.terrain;
  let water = game.water;
  console.log('creating water');
  fillWater(water);

  console.log('creating blocks');
  let blocks = new Lens(new Array(SIZE * SIZE / 16 / 16), [SIZE / 16, SIZE / 16]);
  blocks.updateAll((_, [c, r]) => new Block([c, r], {
    terrain: terrain.window([c * 16, r * 16], [16, 16]),
    water: water.window([c * 16, r * 16], [16, 16])
  }));
  console.log('done');

  let tick = () => {
    let start = new Date();
    game.tick();
    let end = new Date();
    console.log('tick time: ' + (end - start));
    setTimeout(tick, 1000);
  };
  tick();

  return {
    'io': (socket) => {
      socket.on('disconnect', () => {
        console.log('Disconnected: ' + socket.id);
      });

      console.log('Connected: ' + socket.id);
    },

    'block/:col/:row': (req, res) => {
      res.json(blocks.get([parseInt(req['params']['col']), parseInt(req['params']['row'])]));
    }
  };
}
