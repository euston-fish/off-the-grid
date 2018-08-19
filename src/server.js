import { min, max, move_towards, sum, normal } from './shared.js';
import Lens from './Lens.js';
import Block from './Block.js';
import Game from './Game.js';

export default function() {
  let game = new Game();

  const SIZE = 1024;
  let terrain = game.terrain;
  let water = game.water;

  console.log('creating terrain')
  terrain.updateAll(() => {
    return Math.floor(Math.random() * 255);
  });
  let get_around = ([x, y]) => [
    terrain.get([x, y - 1]) || 128,
    terrain.get([x + 1, y - 1]) || 128,
    terrain.get([x + 1, y]) || 128,
    terrain.get([x + 1, y + 1]) || 128,
    terrain.get([x, y + 1]) || 128,
    terrain.get([x - 1, y + 1]) || 128,
    terrain.get([x - 1, y]) || 128,
    terrain.get([x - 1, y - 1]) || 128,
  ];
  let low_point = 0, high_point = 0, mid_point = 0;
  for (let i = 0; i < 10; i++) {
    console.log('iteration ' + i);
    low_point = 255, high_point = 0, mid_point = 0;
    terrain.updateAll((value, [x, y]) => {
      let around = get_around([x, y]);
      let choice = Math.random();
      if (choice < 0.25) {
        let lowest = min(around);
        value = (value + lowest + lowest) / 3;
      } else if (choice < 0.6) {
        let highest = max(around);
        value = (value + highest + highest) / 3;
      } else {
        value = move_towards(value, sum(around) / 8, (Math.random() * 10) + 10);
      }
      low_point = Math.min(low_point, value);
      high_point = Math.max(high_point, value);
      mid_point += value;
      return Math.floor(value);
    });
  }
  mid_point /= SIZE * SIZE;
  let range = high_point - low_point;
  terrain.updateAll((value, [x, y]) => {
    return Math.floor(255 * ((value - low_point) / range));
  });

  console.log('creating water');
  water.updateAll(() => Math.max(Math.floor(normal(Math.random(), Math.random()) * 20 + 70), 0));
  
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
