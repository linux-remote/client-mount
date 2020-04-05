const fs = require('fs');
const jsTplManualEngine = require('../src/js-tpl-manual-engine.js');
const html = jsTplManualEngine({
  lrClientCss: 'https://linux-rmeote.org/css',
  lrClientJs: 'https://linux-rmeote.org/js',
  amdMap: {
    Jquery: 'ahah'
  },
  loadJsArr: ['https://jquery.net', 'https://vue.org'],
  CLIENT_CONFIG: {
    VERSION: '0.0.1'
  },
  prefixUrl: 'prefixUrl'
})

fs.writeFileSync(__dirname + '/index.html', html)