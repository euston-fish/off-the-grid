#![feature(const_fn)]
use std::f32;

extern {
  fn random() -> f64;
  fn log(v: i32);
  fn logf(v: f32);
}

struct Game {
  terrain: [u8; (SIZE * SIZE) as usize],
  water: [u8; (SIZE * SIZE) as usize]
}

fn rand_round(x: f32) -> u8 {
  let probability_high = x - x.floor();
  let rounded_down = x.floor() as i16;
  let rand_rounded = rounded_down + if (unsafe { random() } as f32) < probability_high { 1 } else { 0 };
  (if rand_rounded > 0 { rand_rounded } else { 256 - rand_rounded }) as u8
}

fn flow_amounts(height_a: u8, height_b: u8, water_a: u8, water_b: u8) -> (u8, u8) {
  let saturated_a = water_a > height_a;
  let saturated_b = water_b > height_b;
  let flow_rate: f32 = (if saturated_a { 0.4 } else { 0.01 }) * (if saturated_b { 0.4 } else { 0.01 });
  let height_difference: f32 = water_a as f32 - water_b as f32;
  let water_flow_amount = flow_rate * height_difference;
  let erosion_flow_amount = if saturated_a && saturated_b { water_flow_amount * 0.0004 } else { 0.0 };
  (rand_round(water_flow_amount), rand_round(erosion_flow_amount))
}

impl Game {
  const fn new() -> Game {
    Game {
      terrain: [0; (SIZE * SIZE) as usize],
      water: [0; (SIZE * SIZE) as usize]
    }
  }

  fn index(&self, c: u32, r: u32) -> usize {
    ((c % SIZE) * SIZE + (r % SIZE)) as usize
  }

  fn tick(&mut self) {
    let mut erosion_count: i32 = 0;
    for c in 0..SIZE {
      for r in 0..SIZE {
        let a = self.index(c, r);
        let b = self.index(c+1, r);
        let c = self.index(c, r+1);
        let (flow_b, erosion_flow_b) = flow_amounts(self.terrain[a], self.terrain[b], self.water[a], self.water[b]);
        self.water[a] -= flow_b;
        self.water[b] += flow_b;
        self.terrain[a] -= erosion_flow_b;
        self.terrain[b] += erosion_flow_b;
        erosion_count += (if erosion_flow_b < 128 { erosion_flow_b } else { 0 - erosion_flow_b }) as i32;
        let (flow_c, erosion_flow_c) = flow_amounts(self.terrain[a], self.terrain[c], self.water[a], self.water[c]);
        self.water[a] -= flow_c;
        self.water[c] += flow_c;
        self.terrain[a] -= erosion_flow_b;
        self.terrain[c] += erosion_flow_c;
        erosion_count += (if erosion_flow_c < 128 { erosion_flow_c } else { 0 - erosion_flow_c }) as i32;
      }
    }
    unsafe { log(erosion_count); }
  }

  fn init(&mut self) {
    for (index, mut cell) in self.terrain.iter_mut().enumerate() {
      let x = (index as i32 % SIZE as i32) as f32;
      let y = (index as i32 / SIZE as i32) as f32;
      let s = noise(x / 8.0, y / 8.0) + 1.0;
      let l = noise(x / 24.0, y / 24.0) + 1.0;
      let b = noise(x / 64.0, y / 64.0) + 1.0;
      unsafe {
        logf(s);
        logf(l);
        logf(b);
      }
      *cell = ((s * 0.4 +
                l * 1.8 +
                b * 1.0) * (128.0 / 3.0)) as u8;
    }
    //for mut cell in self.water.iter_mut() { *cell = INITIAL_WATER_LEVEL }
    for mut cell in self.water.iter_mut() {
      *cell = (unsafe { random() } * 256.0) as u8;
    }
  }
}

static mut GAME: Game = Game::new();
static mut NOISE: Noise = Noise::new();

#[no_mangle]
pub fn init() {
  unsafe {
    NOISE.init();
    GAME.init();
  }
}

#[no_mangle]
pub fn tick() {
  unsafe { GAME.tick(); }
}

#[no_mangle]
pub fn address() -> u32 {
  unsafe { (&GAME as *const _) as u32 }
}
fn noise(x: f32, y: f32) -> f32 {
    unsafe { NOISE.get(x, y) }
}

static GRAD3: [[i8; 3]; 12] = [
  [ 1, 1, 0],
  [-1, 1, 0],
  [ 1,-1, 0],
  [-1,-1, 0],
  [ 1, 0, 1],
  [-1, 0, 1],
  [ 1, 0,-1],
  [-1, 0,-1],
  [ 0, 1, 1],
  [ 0,-1, 1],
  [ 0, 1,-1],
  [ 0,-1,-1]
];

struct Noise {
  seed: [u8; 256 as usize]
}

impl Noise {
  const fn new() -> Noise {
    Noise {
      seed: [0; 256 as usize]
    }
  }

  fn init(&mut self) {
    for mut cell in self.seed.iter_mut() {
      *cell = (unsafe { random() } * 256.0) as u8;
    }
  }


  fn get(&self, x: f32, y: f32) -> f32 {
    let f2 = 0.5 * ((3 as f32).sqrt() - 1.0);
    let s = (x + y) * f2;
    let i = (x + s).floor();
    let j = (y + s).floor();
    let g2 = (3.0 - (3 as f32).sqrt()) / 6.0;
    let t = (i + j) * g2;
    let (x0, y0) = (i - t, j - t); // Unskew the cell origin back to (x,y) space
    let (x0, y0) = (x - x0, y - y0); // The x,y distances from the cell origin
    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    let (i1, j1) = if x0 > y0 { (1.0, 0.0) } else { (0.0, 1.0) }; // Offsets for second (middle) corner of simplex in (i,j) coords
    let (x1, y1) = (x0 - i1 + g2, y0 - j1 + g2);
    let (x2, y2) = (x0 - 1.0 + 2.0 * g2, y0 - 1.0 + 2.0 * g2);
    let (ii, jj) = ((i as i32) as u8, (j as i32) as u8);
    let gi0 = self.seed[(ii+self.seed[jj as usize]) as usize] % 12;
    let gi1 = self.seed[(ii+(i1 as u8)+self.seed[(jj+(j1 as u8)) as usize]) as usize] % 12;
    let gi2 = self.seed[(ii+1+self.seed[(jj+1) as usize]) as usize] % 12;
    let t0 = 0.5 - x0.powf(2.0) - y0.powf(2.0);
    let n0 = if t0 < 0.0 { 0.0 } else { t0.powf(4.0) * self.dot(GRAD3[gi0 as usize], x0, y0) };
    let t1 = 0.5 - x1.powf(2.0) - y1.powf(2.0);
    let n1 = if t1 < 0.0 { 0.0 } else { t1.powf(4.0) * self.dot(GRAD3[gi1 as usize], x1, y1) };
    let t2 = 0.5 - x2.powf(2.0) - y2.powf(2.0);
    let n2 = if t2 < 0.0 { 0.0 } else { t2.powf(4.0) * self.dot(GRAD3[gi2 as usize], x2, y2) };
    return 70.0 * (n0 + n1 + n2);
  }

  fn dot(&self, grid: [i8; 3], x: f32, y: f32) -> f32 {
    ((grid[0] as f32) * x + (grid[1] as f32) * y) as f32
  }
}
