use std::f32;
use std::ops::{Index,IndexMut};

extern {
  fn random() -> f64;
  fn log(v: i32);
  fn logf(v: f32);
}

#[derive(Clone,Copy)]
struct Coordinate {
  c: u32,
  r: u32
}

struct Layer {
  values: [u8; (SIZE * SIZE) as usize]
}

impl Index<Coordinate> for Layer {
  type Output = u8;

  fn index(&self, index: Coordinate) -> &u8 {
    let Coordinate { c, r } = index;
    &self.values[((c % SIZE) * SIZE + (r % SIZE)) as usize]
  }
}

impl IndexMut<Coordinate> for Layer {
  fn index_mut(&mut self, index: Coordinate) -> &mut u8 {
    let Coordinate { c, r } = index;
    &mut self.values[((c % SIZE) * SIZE + (r % SIZE)) as usize]
  }
}

struct Game {
  terrain: Layer,
  water: Layer
}

fn rand_round(x: f32) -> u8 {
  let probability_high = x - x.floor();
  let rounded_down = x.floor() as i16;
  let rand_rounded = rounded_down + if (unsafe { random() } as f32) < probability_high { 1 } else { 0 };
  (if rand_rounded > 0 { rand_rounded } else { rand_rounded + 256 }) as u8
}

impl Game {
  fn index(&self, c: u32, r: u32) -> usize {
    ((c % SIZE) * SIZE + (r % SIZE)) as usize
  }

  fn flow(&mut self, a: Coordinate, b: Coordinate, amount: u8) {
    self.water[a] -= amount;
    self.water[b] += amount;
  }

  fn erode(&mut self, a: Coordinate, b: Coordinate, amount: u8) {
    self.terrain[a] -= amount;
    self.terrain[b] += amount;
  }

  #[inline(always)]
  fn flow_amount(&self, a: Coordinate, b: Coordinate) -> u8 {
    match (self.terrain[a], self.terrain[b], self.water[a], self.water[b]) {
      (_, _, wa, wb) if wa < wb => 0, // don't flow up
      (ta, _, wa, _) if wa <= ta - DRY_DEPTH => 0, // don't flow out of a dry square
      (ta, tb, wa, wb) if wa <= ta && wb <= tb => rand_round((wa - wb) as f32 * 0.001), // flow slowly through earth
      (ta, _, wa, wb) if wa <= ta => rand_round((wa - wb) as f32 * 0.05), // flow kinda slowly out of earth
      (_, _, wa, wb) => rand_round((wa - wb) as f32 * 0.4), // flow normally out of saturated land
    }
  }

  #[inline(always)]
  fn erosion_amount(&self, a: Coordinate, b: Coordinate, flow_amount: u8) -> u8 {
    if self.terrain[a] <= self.terrain[b] {
      0
    } else {
      rand_round((self.terrain[a] - self.terrain[b]) as f32 * 0.001 * flow_amount as f32)
    }
  }

  #[inline(always)]
  fn consider_pair(&mut self, a: Coordinate, b: Coordinate) {
    let flow = self.flow_amount(a, b);
    let erosion = self.erosion_amount(a, b, flow);
    self.flow(a, b, flow);
    self.erode(a, b, erosion);
  }

  fn tick(&mut self) {
    for c in 0..SIZE {
      for r in 0..SIZE {
        let a = Coordinate { c, r };
        let b = Coordinate { c: c + 1, r: r };
        let c = Coordinate { c: c, r: r + 1 };
        self.consider_pair(a, b);
        self.consider_pair(b, a);
        self.consider_pair(a, c);
        self.consider_pair(c, a);
      }
    }
  }

  fn init(&mut self) {
    for (index, mut cell) in self.terrain.values.iter_mut().enumerate() {
      let x = (index as i32 % SIZE as i32) as f32;
      let y = (index as i32 / SIZE as i32) as f32;
      let s = noise(x / 8.0, y / 8.0) + 0.5;
      let l = noise(x / 24.0, y / 24.0) + 1.0;
      let b = noise(x / 64.0, y / 64.0) + 1.0;
      *cell = ((s * 0.7 +
                l * 1.8 +
                b * 0.8) * (128.0 / 3.0)) as u8;
    }

    for (mut water, terrain) in self.water.values.iter_mut().zip(self.terrain.values.iter()) {
      let lowest_level = (*terrain - DRY_DEPTH) as f32;
      let highest_level = (*terrain + 10) as f32;
      *water = (unsafe { random() as f32 } * (highest_level - lowest_level) + lowest_level).min(255.0).max(0.0) as u8;
    }
  }
}

static mut GAME: Game =
  Game {
    terrain: Layer { values: [0; (SIZE * SIZE) as usize] },
    water: Layer { values: [0; (SIZE * SIZE) as usize] }
  };
static mut NOISE: Noise =
  Noise {
    seed: [0; 256 as usize]
  };

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
