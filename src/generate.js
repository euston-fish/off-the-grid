import { SIZE, normal, min, max, sum, move_towards, randRound } from './shared.js';
import Lens from './Lens.js';
import Block from './Block.js';
import SimplexNoise from './noise.js';

export const makeTerrain = () => {
  let terrain = Lens.arrayAccess(new Uint8Array(SIZE * SIZE), [SIZE, SIZE]);
  let small_scale = new SimplexNoise();
  let large_scale = new SimplexNoise();
  let big_scale = new SimplexNoise();
  terrain.updateAll((value, [x, y]) => {
    let s = small_scale.noise(x / 8, y / 8) + 1;
    let l = large_scale.noise(x / 24, y / 24) + 1;
    let b = big_scale.noise(x / 64, y / 64) + 1;
    return Math.min(255, Math.floor(
      (s * 0.4 +
       l * 1.8 +
       b * 1) * (128 / 3))
    );
  });
  return terrain;
};

export const makeWater = () => {
  let water = Lens.arrayAccess(new Uint8Array(SIZE * SIZE), [SIZE, SIZE]);
  water.updateAll(() => 70);
  // Math.floor(normal(Math.random(), Math.random()) * 50));
  return water;
};
