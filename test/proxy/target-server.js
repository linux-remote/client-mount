const http = require('http');
const WebSocket = require('ws');
const wsServer = new WebSocket.Server({ noServer: true });
const targetPort = 3003;

const targetServer = http.createServer(function(req, res){ 
  if(req.url.indexOf('/api')  === 0){
    res.setHeader('Set-Cookie', ['lr_sid=abcdefgend; HttpOnly; Path=/api']);
    res.end('hello ajax!' + req.url);
  } else {
    res.end('targetServer');
  }
  
});

targetServer.listen(targetPort);

targetServer.on('upgrade', function handleServerUpgrade(req, socket, head) {
  wsServer.handleUpgrade(req, socket, head, function done(ws) {
    wsServer.emit('connection', ws);
  });
});

wsServer.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send(message + ' ws!');
  });
});

module.exports = targetPort;