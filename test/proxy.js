const http = require('http');
const createProxy = require('../src/proxy');
const option = {
  target: 'http://192.168.56.101:3000'
};
const proxy = createProxy(option)

proxy.on('proxyReq', function(proxyReq, req){
  
  console.log('-------------------------');
  console.log('req.url', req.url);
  console.log('proxyReq.cookie', proxyReq.getHeader('Cookie'));
  console.log('req.cookie', req.headers['cookie']);
});

const server = http.createServer(function(req, res){
  if(req.url.indexOf('/api')  === 0){
    res.setHeader('Set-Cookie', ['lr_sid=abcdefgend; HttpOnly; Path=/api']);
    proxy.web(req, res);
  } else {
    res.end('hello world!');
  }
});

server.listen(3002);