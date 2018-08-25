import { SIZE } from '../tmp/constants.js';
import Game from './Game.js';

export default function() {
  let game = new Game();

  let terrain = game.terrain;
  let water = game.water;

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

    'terrain/:col/:row/:width/:height': (req, res) => {
      let [col, row, width, height] = ['col', 'row', 'width', 'height'].map(a => parseInt(req['params'][a]));
      let response = [];
      for (let c = col; c < col + width; c++) {
        for (let r = row; r < row + height; r++) {
          response.push(terrain.get([c.mod(SIZE), r.mod(SIZE)]));
        }
      }
      res.json(response);
    },

    'water/:col/:row/:width/:height': (req, res) => {
      let [col, row, width, height] = ['col', 'row', 'width', 'height'].map(a => parseInt(req['params'][a]));
      let response = [];
      for (let c = col; c < col + width; c++) {
        for (let r = row; r < row + height; r++) {
          response.push(water.get([c.mod(SIZE), r.mod(SIZE)]));
        }
      }
      res.json(response);
    },
    'place_instruction/:x/:y/:type': (req, res) => {
      let [x, y, type] = ['x', 'y', 'type'].map(a => parseInt(req['params'][a]));
      console.log(`Placing ${type} at ${x},${y}`);
      res.json({ ok: 'sick' });
    },
  };
}
