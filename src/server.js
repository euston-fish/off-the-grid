import { normal, randRound } from './shared.js';
import Lens from './Lens.js';
import Block from './Block.js';

export default function() {
  const SIZE = 128;
  console.log('creating terrain');
  let terrain = Lens.arrayAccess(new Uint8Array(SIZE * SIZE), [SIZE, SIZE]);
  terrain.updateAll(() => {
    return Math.floor(normal(Math.random(), Math.random()) * 128);
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
