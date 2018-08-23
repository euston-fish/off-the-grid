import { W, pixelToWorld, worldToPixel } from './shared.js';
import { scale_over_range } from './shared.js';
import Block from './Block.js';

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
  if (height > 110) {
    height = (height - 110) / 110;
    return 'hsl(87,48%,' + Math.floor(scale_over_range(height, 40, 15)) + '%)';
  }
  height = height / 110;
  return 'hsl(70,56%,' + Math.floor(scale_over_range(height, 55, 34)) + '%)';
};

const draw = (ctx, canvas, viewport_offset, blockManager, cursor_location, show_hover) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let [cs, rs] = pixelToWorld(viewport_offset, [0, 0]);
  let [ce, re] = pixelToWorld(viewport_offset, [canvas.width, canvas.height]);
  let [cx, cy] = pixelToWorld(viewport_offset, cursor_location);
  for (let c = cs; c <= ce; c++) {
    for (let r = rs; r <= re; r++) {
      let block = blockManager.get(Block.worldToBlock([c, r]));
      let internalCoord = block.coordFromWorld([c, r]);
      let waterHeight = block.water.get(internalCoord);
      let height = block.terrain.get(internalCoord);
      let params = {
        'water': waterHeight,
        'terrain': height
      };
      let [px, py] = worldToPixel(viewport_offset, [c, r]);
      ctx.fillStyle = env_to_color(height, waterHeight);
      ctx.fillRect(px, py, W, W);
      if (show_hover && c == cx && r == cy) {
        ctx.fillStyle = 'rgba(255,255,255,30%)';
        ctx.fillRect(px, py, W, W);
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
