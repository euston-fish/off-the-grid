import { scale_over_range } from './shared.js';
import BlockManager from './BlockManager.js';
import Block from './Block.js';
import GridItem from './GridItem.js';

export default (function (DEBUG) {
  /* global io */
  window.addEventListener('load', () => {
    const W = 32;

    if (DEBUG) {
      window['debugParams'] = [];
    }

    let socket;

    let blockManager = new BlockManager();
    blockManager.addEventListener('update', () => window.requestAnimationFrame(draw));

    let objects = [
      [[12, 23], new GridItem('cloud', {direction: 2})],
      [[18, 24], new GridItem('cloud', {direction: 3})],
      [[14, 24], new GridItem('trees')],
    ];

    let env_to_color = (height, water_height) => {
      if (water_height > height) {
        water_height = water_height / 255;
        return 'hsl(230,80%,' + scale_over_range(water_height, 32, 72) + '%)';
      }
      if (height > 240) {
        height = (height - 240) / 15;
        return 'hsl(0,0%,' + scale_over_range(height, 70, 90) + '%)';
      }
      if (height > 220) {
        height = (height - 220) / 35;
        return 'hsl(35,48%,' + scale_over_range(height, 29, 15) + '%)';
      }
      if (height > 110) {
        height = (height - 110) / 110;
        return 'hsl(87,48%,' + scale_over_range(height, 40, 15) + '%)';
      }
      height = height / 110;
      return 'hsl(70,56%,' + scale_over_range(height, 55, 34) + '%)';
    };

    let bind = () => {
      socket.on('start', () => {
        console.log('Started');
      });

      socket.on('connect', () => {
        console.log('Connected');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected');
      });

      socket.on('error', () => {
        console.log('Oh shit');
      });

      // socket.emit('guess', guess);
    };

    socket = io({ upgrade: false, transports: ['websocket'] });
    let canvas = document.getElementById('c');
    let ctx = canvas.getContext('2d');
    let resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    let viewport_offset = [0, 0];
    let prev_mouse_location = null;

    // take a world coordinate, and give the pixel of its upper-left corner
    let worldToPixel = (world) => world.scale(W).sub(viewport_offset);
    // take a pixel coordinate, and give which world coordinate it's within
    let pixelToWorld = (pixel) => pixel.add(viewport_offset).scale(1 / W).map(Math.floor);

    canvas.addEventListener('mousedown', (event) => prev_mouse_location = [event.x, event.y]);
    canvas.addEventListener('mouseup', () => prev_mouse_location = null);
    canvas.addEventListener('mousemove', (event) => {
      if (prev_mouse_location) {
        let delta = [event.x, event.y].sub(prev_mouse_location);
        viewport_offset = viewport_offset.sub(delta);
        prev_mouse_location = [event.x, event.y];
        window.requestAnimationFrame(draw);
        viewport_offset = viewport_offset.map(c => Math.max(c, 0));
      }
    });
    let draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let [cs, rs] = pixelToWorld([0, 0]);
      let [ce, re] = pixelToWorld([canvas.width, canvas.height]);
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
          let [px, py] = worldToPixel([c, r]);
          ctx.fillStyle = env_to_color(height, waterHeight);
          ctx.fillRect(px, py, W, W);
          if (DEBUG) {
            ctx.font = '12px sans-serif';
            ctx.textBaseline = 'top';
            ctx.fillStyle = 'black';
            let offset = 1;
            for (let param of (window['debugParams'] || [])) {
              ctx.fillText(params[param], px + 1, py + offset);
              offset += 13;
            }
          }
        }
      }
      objects.forEach(([[c, r], object]) => {
        ctx.save();
        let [px, py] = worldToPixel([c, r]);
        ctx.translate(px, py);
        object.draw(ctx);
        ctx.restore();
      });
      if (DEBUG) {
        ctx.fillText([cs, rs].toString(), 5, 5);
      }
    };

    bind();
    draw();
  }, false);
});
