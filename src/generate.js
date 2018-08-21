import SimplexNoise from './noise.js';

export const fillWater = (water) => {
  water.updateAll(() => 70);
  // Math.floor(normal(Math.random(), Math.random()) * 50));
};
