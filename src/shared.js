export const add = ([x, y], [z, w]) => [x+z, y+w];
export const inv = ([x, y]) => [-x, -y];
export const sub = (a, b) => add(a, inv(b));
export const scale = ([x, y], s) => [x*s, y*s];
export const normal = (uniform_1, uniform_2) => Math.sqrt(-2 * Math.log(uniform_1)) * Math.cos(2 * Math.PI * uniform_2);
export const inspect = (x) => { console.log(x); return x; };
export const rand_range = (lower, upper) => lower + Math.random() * (upper - lower)
export const scale_over_range = (portion, lower, upper) => lower + (upper - lower) * portion;

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
