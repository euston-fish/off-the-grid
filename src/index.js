import server from './server.js';
import client from './client.js';

/* global DEBUG */

if (eval('typeof window') !== 'undefined') client(DEBUG);
else module.exports = server(DEBUG);
