export const add = ([x, y], [z, w]) => [x+z, y+w];
export const inv = ([x, y]) => [-x, -y];
export const sub = (a, b) => add(a, inv(b));
export const normal = (uniform_1, uniform_2) => Math.sqrt(-2 * Math.log(uniform_1)) * Math.cos(2 * Math.PI * uniform_2);
