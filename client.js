const makeCapTpFromStream = require('captp-stream');
const websocket = require('websocket-stream');
const pipeline = require('pumpify');
const ndjson = require('ndjson');
const harden = require('@agoric/harden');

module.exports = function connectToAddress (address) {
  const ws = websocket(address, {
    binary: false,
    objectMode: true,
  });

  const stream = pipeline.obj(ndjson.serialize(), ws, ndjson.parse());

  const { E, getBootstrap, abort } = makeCapTpFromStream('server', stream, harden({}));

  return {
    E,
    getBootstrap,
    abort: () => {
      abort();
      stream.destroy();
    }
  }
}
