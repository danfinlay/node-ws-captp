const makeCapTpAndStream = require('captp-stream');
const websocket = require('websocket-stream');
const pipeline = require('pumpify');
const ndjson = require('ndjson');
const harden = require('@agoric/harden');

module.exports = function connectToAddress (address) {
  const ws = websocket(address, {
    binary: false,
    objectMode: true,
  });

  const { E, getBootstrap, abort, captpStream } = makeCapTpAndStream('server', harden({}));
  pipeline.obj(captpStream, ws, captpStream);

  return {
    E,
    getBootstrap,
    abort: () => {
      abort();
      captpStream.destroy();
    }
  }
}
