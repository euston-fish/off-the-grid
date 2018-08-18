import { rand_range } from './shared.js';

function GridItem(type, args) {
  this.type = type;
  this.args = args || {};
  if (this.type == 'trees') {
    this.args.colors = [];
    for (let i = 0; i < 16; i++) {
      this.args.colors.push('hsl(104,66%,' + rand_range(21, 41) + '%)');
    }
  }
}

const renderers = {
  'cloud': (ctx, item) => {
    let coords = [
      [0, 0, 32, 10],
      [23, 0, 10, 32],
      [0, 22, 32, 10],
      [0, 0, 10, 32],
    ][item.args.direction || 0];
    ctx.fillStyle = '#CADDE3bb';
    ctx.fillRect(...coords);
  },
  'rain': (ctx, item) => {
    item;
    ctx.fillStyle = '#77AEEDbb';
    ctx.fillRect(12, 12, 10, 10);
  },
  'trees': (ctx, item) => {
    item.args.colors.forEach((color, idx) => {
      ctx.fillStyle = color;
      ctx.fillRect((idx % 4) * 8, Math.floor(idx / 4) * 8, 8, 8);
    });
  }
};

GridItem.prototype.draw = function(ctx) {
  renderers[this.type](ctx, this);
};

export default GridItem;
