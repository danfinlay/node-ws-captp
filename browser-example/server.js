const { createServer } = require('../');

const greeting = 'Hello, world!';

const bootstrap  = {
  greet: async () => greeting,
};

const killServer = createServer(bootstrap, 8088);
console.log('listening on port 8088');

