# Node Websocket CapTP

A node.js module for exposing and connecting with [CapTP](https://github.com/Agoric/CapTP) over Websockets.

This builds on the module `ws`, which uses the node Socket API, and so this should only work in node, but if your bundler polyfills node APIs like [browserify](https://www.npmjs.com/package/browserify) does, you may find it works, as it does in the [browser example](./browser-example).

## Installation

`npm i node-ws-captp -S` or `yarn add node-ws-captp`.

## Usage

Complete usage for both client and server can be observed in a single very simple test:

```javascript
const { createServer, createClient } = require('node-ws-captp');

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
```

