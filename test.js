const test = require('tape');
const { createServer, createClient } = require('./');

test('basic connection', async (t) => {
  const greeting = 'Hello, world!';

  const bootstrap  = {
    greet: async () => greeting,
  };

  const killServer = createServer(bootstrap, 8088);

  const { E, getBootstrap, abort } = createClient('http://localhost:8088');

  const value = await E(getBootstrap()).greet();
  t.equals(value, greeting, 'Returned greeting over server');
  abort();
  killServer();
  t.end();
});

test('ping-pong connection', async (t) => {
  const bootstrap  = {
    ping: async (msg) => {
      if (msg === 'ping') {
        return 'pong';
      }
    },
  };

  const killServer = createServer(bootstrap, 8088);

  const { E, getBootstrap, abort } = createClient('http://localhost:8088');

  const value = await E(getBootstrap()).ping('ping');
  t.equals(value, 'pong', 'Returned greeting over server');
  abort();
  killServer();
  t.end();
});
