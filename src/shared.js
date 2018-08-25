export const add = ([x, y], [z, w]) => [x+z, y+w];
export const inv = ([x, y]) => [-x, -y];
export const sub = (a, b) => add(a, inv(b));
export const scale = ([x, y], s) => [x*s, y*s];
export const magnitude = ([a, b]) => Math.sqrt(a*a + b*b);
export const normal = (uniform_1, uniform_2) => Math.sqrt(-2 * Math.log(uniform_1)) * Math.cos(2 * Math.PI * uniform_2);
export const inspect = (x) => { console.log(x); return x; };
export const scale_over_range = (portion, lower, upper) =>
  lower + (upper - lower) * portion;
export const rand_range = (lower, upper) =>
  lower + Math.random() * (upper - lower);
export const move_towards = (from, to, max_amount) =>
  from < to ? Math.min(from + max_amount, to) : Math.max(from - max_amount, to);
export const sum = (arr) => arr.reduce((a, b) => a + b, 0);
export const min = (arr) => arr.reduce((a, b) => a < b ? a : b);
export const max = (arr) => arr.reduce((a, b) => a > b ? a : b);
export const randRound = (val) => Math.floor(val) + (Math.random() < val - Math.floor(val));
export const within = ([c, r], [x, y], [s, t]) => x <= c && c < s && y <= r && r < t;
// take a world coordinate, and give the pixel of its upper-left corner
export const worldToPixel = (viewport_offset, world) => world.scale(W).sub(viewport_offset);
// take a pixel coordinate, and give which world coordinate it's within
export const pixelToWorld = (viewport_offset, pixel) => pixel.add(viewport_offset).scale(1 / W).map(Math.floor);
export const W = 32;

/*
let isIterable = (x) => x != null && typeof x[Symbol.iterator] === 'function';
let zipIterator = (x, y) => {
  let xIt = x[Symbol.iterator](), yIt = y[Symbol.iterator]();
  return {
    next: () => {
      let { value: xVal, done: xDone } = xIt.next(),
        { value: yVal, done: yDone } = yIt.next();
      return { value: [ xVal, yVal ], done: xDone || yDone };
    }
  };
};
let iota = {
  [Symbol.iterator]: () => {
    let x = 0;
    return {
      next: () => ({ value: x++, done: false })
    };
  }
};
*/
