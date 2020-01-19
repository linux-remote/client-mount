const path = require('path');
const fs = require('fs');
const https = require('https');

const localStaticMap = require('./local-static.json');
const xtermVersion = '3.14.5';
const versionMap = {
  "require": "2.3.6",
  "jquery": "3.4.1",
  "vueRuntime": "2.5.16",
  "vuex": "3.0.1",
  "vueRouter": "3.0.1",
  "pako": "1.0.10",
  "xterm": xtermVersion,
  "xtermCss": xtermVersion,
  "xtermAttach": xtermVersion,
  "xtermFit": xtermVersion,
  "xtermWebLinks": xtermVersion
}

function parse(conf, callback){
  getClientVersion(conf, function(err, version){
    if(err){
      err.message = 'Get client version fail: ' + err.message
      return callback(err);
    }
    conf._clientVersion = version;
    const data = _parse(conf);
    callback(null, data);
  })
}
function _parse(conf){
  let clientUrl = conf.LRClientPages ? conf.LRClientPages + 'dist/' : '/build/';
  const CLIENT_CONFIG = {
    clientVersion: conf._clientVersion,
    CORS: conf.CORS
  }
  let cdn = conf.cdn;
  let map = Object.create(null);
  Object.assign(map, localStaticMap);
  if(cdn){
    Object.assign(map, cdn);
  }
  
  const loadJsArr = [];
  Object.keys(versionMap).forEach((k) =>{
    map[k] = map[k].replace(/\{\{VERSION\}\}/g, versionMap[k]);
  });

  ['jquery', 'vueRuntime', 'vuex', 'vueRouter', 'require'].forEach(k => {
    loadJsArr.push(map[k]);
  });
  
  let LRClientCss, LRClientJs;
  if(conf._dev){
    LRClientJs = '/dist/dev/build/lr-client.js';
  } else {
    LRClientJs = clientUrl + conf._clientVersion + '/lr-client.min.js';
  }

  loadJsArr.push(LRClientJs);
  const requirePaths = Object.create(null);
  ['pako', 'xterm', 'xtermCss', 'xtermAttach', 'xtermFit', 'xtermWebLinks'].forEach(k => {
    requirePaths[k] = map[k];
  });

  return {
    LRClientCss,
    loadJsArr,
    CLIENT_CONFIG,
    requirePaths
  }
}
// githubPagesCdn = false;
function getClientVersion({cdn, _dev}, callback){
  if(_dev){
    return callback(null, 'dev');
  }
  let version;
  if(cdn.LRClientPages !== undefined){
    https.get(cdn.LRClientPages + 'package.json', function(res){
      if(res.statusCode !== 200){
        return callback(new Error('Request Failed. ' + `Status Code: ${res.statusCode}`));
      }
      // https://nodejs.org/api/http.html#http_http_get_url_options_callback
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          callback(null, parsedData.version);
        } catch (e) {
          callback(e);
        }
      });
    })
  } else {
    version = require.resolve('linux-remote-client');
    version = path.dirname(version);
    fs.readFile(path.join(version, 'package.json'), 'utf-8', function(err, content){
      if(err){
        return callback(err);
      }
      version = JSON.parse(content);
      version = version.version;
      callback(null, version);
    })
  }
}

// function getPathByModuleName(){
//   let v = require.resolve('linux-remote-client');
//   v = path.dirname(version);
// }
module.exports = {
  getClientVersion,
  parse
};