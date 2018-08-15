'use strict';
/*global io*/

window.addEventListener('load', () => {
  let socket;

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

  let draw = () => {
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0,0,150,75);
    window.requestAnimationFrame(draw);
  };

  bind();
  draw();
}, false);
