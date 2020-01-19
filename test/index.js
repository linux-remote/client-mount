const {clientIndex} = require('../index');
clientIndex({
  _dev: true,
  CORS: 'http://192.168.56.101:3000',
  // cdn: {
  //   jquery: 'abc/{{VERSION}}',
  //   LRClientPages: 'https://linux-remote.github.io/client/'
  // }
}, false, function(err, html){
  if(err){
    return console.error(err);
  }
  console.log('success!');
  console.log('result', html);
})