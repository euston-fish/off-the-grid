import { W, pixelToWorld, worldToPixel, scale_over_range } from './shared.js';

/* global DEBUG */

let env_to_color = (height, water) => {
  let water_height = height + water;
  if (water_height > height) {
    water_height = water_height / 255;
    return 'hsl(230,80%,' + Math.floor(scale_over_range(water_height, 32, 72)) + '%)';
  }
  if (height > 240) {
    height = (height - 240) / 15;
    return 'hsl(0,0%,' + Math.floor(scale_over_range(height, 70, 90)) + '%)';
  }
  if (height > 220) {
    height = (height - 220) / 35;
    return 'hsl(35,48%,' + Math.floor(scale_over_range(height, 29, 15)) + '%)';
  }
  height = height / 110;
  return 'hsl(70,56%,' + Math.floor(scale_over_range(height, 55, 34)) + '%)';
};

let vege_color = (height) => {
  return 'hsla(131, 70%, 31%, ' + Math.floor((height + 40) / 295 * 100) + '%)';
}

const draw = (
  ctx,
  canvas,
  viewport_offset,
  terrain,
  water,
  vegetation,
  cursor_location,
  active_instruction) => {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let [cs, rs] = pixelToWorld(viewport_offset, [0, 0]);
  let [ce, re] = pixelToWorld(viewport_offset, [canvas.width, canvas.height]);
  let [cx, cy] = pixelToWorld(viewport_offset, cursor_location);
  for (let c = cs; c <= ce; c++) {
    for (let r = rs; r <= re; r++) {
      let height = terrain.get([c, r]);
      let waterHeight = water.get([c, r]);
      let vegetation_height = vegetation.get([c, r]);
      let params = {
        'water': waterHeight || NaN,
        'terrain': height || NaN,
        'vegetation': vegetation_height ||NaN,
      };
      let [px, py] = worldToPixel(viewport_offset, [c, r]);
      ctx.fillStyle = env_to_color(height, waterHeight);
      ctx.fillRect(px, py, W, W);
      if (vegetation_height > 0) {
        ctx.fillStyle = vege_color(vegetation_height);
        ctx.fillRect(px, py, W, W);
      }
      if (active_instruction && c == cx && r == cy) {
        if (active_instruction.canApplyTo(params)) {
          ctx.fillStyle = 'rgba(255,255,255,30%)';
          ctx.fillRect(px, py, W, W);
        } else {
          ctx.strokeStyle = 'rgba(255,255,255,30%)';
          ctx.lineWidth = 1;
          ctx.strokeRect(px, py, W - 1, W - 1);
        }
      }
      if (DEBUG) {
        ctx.font = '12px sans-serif';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'black';
        let offset = 1;
        for (let param of (window['debugParams'] || [])) {
          ctx.fillText(params[param].toFixed(0), px + 1, py + offset);
          offset += 13;
        }
      }
    }
  }
  if (DEBUG) {
    ctx.fillText([cs, rs].toString(), 5, 5);
  }
};

export default draw;
