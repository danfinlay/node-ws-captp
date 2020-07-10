const makeCapTpAndStream = require('captp-stream');
const ndjson = require('ndjson');
const pipeline = require('pumpify');
const harden = require('@agoric/harden');

const http = require('http');
const websocket = require('websocket-stream')
const WebSocketServer = require('ws').Server

module.exports = function hostWsCapTpServerAtPort (bootstrap, port, _server) {
  let server;
  if (!_server) {
    server = http.createServer();
  }

  let abort;
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
    if (server) {
      server.close();
    }
  }
}

function handle (ws, bootstrap) {
  const { abort, captpStream } = makeCapTpAndStream('server', harden(bootstrap));
  pipeline.obj(captpStream, ws, captpStream);
  return abort;
}
