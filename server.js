const makeCapTpFromStream = require('captp-stream');
const ndjson = require('ndjson');
const pipeline = require('pumpify');
const harden = require('@agoric/harden');

const http = require('http');
const websocket = require('websocket-stream')
const WebSocketServer = require('ws').Server

module.exports = function hostWsCapTpServerAtPort (bootstrap, port) {
  let abort;
  const server = http.createServer();
  const wss = new WebSocketServer({
    server: server,
  });

  server.listen(port, function() {
    wss.on('connection', function(ws) {
      const stream = websocket(ws, { objectMode: true });
      abort = handle(stream, bootstrap);
    })
  });

  return () => {
    abort();
    server.close();
  }
}

function handle (ws, bootstrap) {
  const stream = pipeline.obj(ndjson.serialize(),  ws, ndjson.parse());
  const { abort } = makeCapTpFromStream('server', stream, harden(bootstrap));
  return abort;
}
