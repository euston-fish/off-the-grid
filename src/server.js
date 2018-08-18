import { normal, min, max, sum, move_towards, randRound } from './shared.js';
import Lens from './Lens.js';
import Block from './Block.js';

export default function() {
  const SIZE = 128;
  console.log('creating terrain');
  let terrain = Lens.arrayAccess(new Uint8Array(SIZE * SIZE), [SIZE, SIZE]);
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
  let water = Lens.arrayAccess(new Uint8Array(SIZE * SIZE), [SIZE, SIZE]);
  water.updateAll(() => Math.floor(normal(Math.random(), Math.random()) * 50));

  console.log('creating blocks');
  let blocks = Lens.arrayAccess(new Array(SIZE * SIZE / 16 / 16), [SIZE / 16, SIZE / 16]);
  blocks.updateAll((_, [c, r]) => new Block([c, r], {
    terrain: terrain.window([c * 16, r * 16], [16, 16]),
    water: water.window([c * 16, r * 16], [16, 16])
  }));
  console.log('done');

  let flowCount = 0;
  let erosionCount = 0;

  let tick = () => {
    water.keys().forEach(a => {
      for (let b of [[0, 1], [1, 0]].map(d => d.add(a))) {
        let depths = [a, b].map(c => water.get(c));
        let terrains = [a, b].map(c => terrain.get(c));
        let saturated = Array.zip(depths, terrains).map(([depth, terrain]) => depth > terrain);
        let flowRate = saturated.map(s => s ? 0.4 : 0.01).product();
        let flowAmount = (depths[0] - depths[1]) * flowRate;
        let erosionFlowAmount = (saturated[0] && saturated[1]) ? (flowAmount * 0.0004) : 0;
        flowAmount = randRound(flowAmount);
        erosionFlowAmount = randRound(erosionFlowAmount);
        flowCount += Math.abs(flowAmount);
        erosionCount += Math.abs(erosionFlowAmount);
        water.set(a, depths[0] - flowAmount);
        water.set(b, depths[1] + flowAmount);
        terrain.set(a, terrains[0] - erosionFlowAmount);
        terrain.set(b, terrains[1] + erosionFlowAmount);
      }
    });
    console.log(`flowCount:    ${flowCount}`);
    console.log(`erosionCount: ${erosionCount}`);
    setTimeout(tick, 2000);
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
