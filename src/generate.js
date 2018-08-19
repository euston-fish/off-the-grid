import { SIZE, normal, min, max, sum, move_towards, randRound } from './shared.js';
import makeTerrain from './generate.js';
import Lens from './Lens.js';
import Block from './Block.js';
import SimplexNoise from './noise.js';
export const makeTerrain = () => {
  let terrain = Lens.arrayAccess(new Uint8Array(SIZE * SIZE), [SIZE, SIZE]);
  // terrain.updateAll(() => {
  //   return Math.floor(Math.random() * 255);
  // });
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
  let simp = new SimplexNoise();
  terrain.updateAll((value, [x, y]) => {
    return Math.floor(simp.noise(x, y) * 255);
  });
  let low_point = 0, high_point = 0, mid_point = 0;
  for (let i = 0; i < 3; i++) {
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
  console.log(mid_point, high_point, low_point)
  terrain.updateAll((value, [x, y]) => {
    return Math.floor(255 * ((value - low_point) / range));
  });
};

