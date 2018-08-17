import server from './server.js';
import client from './client.js';

if (eval('typeof window') !== 'undefined') client();
else module.exports = server();
