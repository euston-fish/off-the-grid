import { SIZE } from '../tmp/constants.js';
import { Instruction } from './Instruction.js';
import Game from './Game.js';

export default function() {
  let game = new Game();

  let terrain = game.terrain;
  let water = game.water;
  let vegetation = game.vegetation;

  let cooperate = (iter_count, callback) => {
    setTimeout(() => {
      let start = new Date();
      for (let i = 0; i < 10; i++) game.tick();
      let end = new Date();
      console.log('Time for 10 generations: ' + (end - start) + 'ms');
      if (iter_count > 0) {
        cooperate(iter_count - 10, callback);
      } else {
        callback();
      }
    }, 100);
  };

  let tick = () => {
    let start = new Date();
    game.tick();
    let end = new Date();
    console.log('tick time: ' + (end - start));
    setTimeout(tick, 1000);
  };
  cooperate(0, tick);

  return {
    'io': (socket) => {
      socket.on('disconnect', () => {
        console.log('Disconnected: ' + socket.id);
      });

      console.log('Connected: ' + socket.id);
    },

    // TODO Merge these all into one request
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
    'vegetation/:col/:row/:width/:height': (req, res) => {
      let [col, row, width, height] = ['col', 'row', 'width', 'height'].map(a => parseInt(req['params'][a]));
      let response = [];
      for (let c = col; c < col + width; c++) {
        for (let r = row; r < row + height; r++) {
          response.push(vegetation.get([c.mod(SIZE), r.mod(SIZE)]));
        }
      }
      res.json(response);
    },

    'place_instruction/:x/:y/:code/:impact': (req, res) => {
      let [x, y, code] = ['x', 'y', 'code'].map(a => parseInt(req['params'][a]));
      let impact = parseFloat(req['params']['impact']);
      let instruction = Instruction.fromCodeAndIntensity(code, impact);
      console.log(`Placing ${code} at ${x},${y}`);
      game.addInstruction([x, y], instruction);
      res.json({ ok: 'sick' });
    },
  };
}
