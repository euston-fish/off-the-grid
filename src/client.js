import { scale_over_range } from './shared.js';
import BlockManager from './BlockManager.js';
import Block from './Block.js';
import GridItem from './GridItem.js';
import draw from './draw.js';

export default (function (DEBUG) {
  /* global io */
  window.addEventListener('load', () => {

    if (DEBUG) {
      window['debugParams'] = [];
    }

    let socket;

    let blockManager = new BlockManager();

    let objects = [
      [[12, 23], new GridItem('cloud', {direction: 2})],
      [[18, 24], new GridItem('cloud', {direction: 3})],
      [[14, 24], new GridItem('trees')],
    ];

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

    let repaint = () => draw(
      ctx,
      canvas,
      viewport_offset,
      objects,
      blockManager
    );
    blockManager.addEventListener('update',
      () => window.requestAnimationFrame(repaint));

    canvas.addEventListener('mousedown', (event) => prev_mouse_location = [event.x, event.y]);
    canvas.addEventListener('mouseup', () => prev_mouse_location = null);
    canvas.addEventListener('mousemove', (event) => {
      if (prev_mouse_location) {
        let delta = [event.x, event.y].sub(prev_mouse_location);
        viewport_offset = viewport_offset.sub(delta);
        prev_mouse_location = [event.x, event.y];
        window.requestAnimationFrame(repaint);
        viewport_offset.map(c => Math.max(c, 0));
      }
    });

    bind();
    repaint();
  }, false);
});
