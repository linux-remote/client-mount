const http = require('http');
const fs = require('fs');
const path = require('path');

const createProxy = require('../../src/proxy');
const targetPort = require('./target-server');

const proxy = createProxy({
  target: 'http://127.0.0.1:' + targetPort
});

proxy.on('proxyReq', function(proxyReq, req){
  console.log('-------------------------');
  console.log('req.url', req.url);
  console.log('proxyReq.cookie', proxyReq.getHeader('Cookie'));
  console.log('req.cookie', req.headers['cookie']);
});

const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
const clientServer = http.createServer(function(req, res){

  if(req.url.indexOf('/api')  === 0){
    proxy.web(req, res);
  } else if(req.url === '/'){
    res.setHeader('Content-Type', 'text/html');
    res.end(indexHtml);
  } else {
    res.end('404');
  }
});

clientServer.on('upgrade', function(req, socket, head){
  proxy.ws(req, socket, head);
});

clientServer.listen(3002);