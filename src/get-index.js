const path = require('path');
const fs = require('fs');

const ejs = require('ejs');
const {localUnpkgMap, wrapDistedUrl, getFilePathByUrl} = require('../../local-unpkg/index.js');
const { localUnpkgPrefix } = require('./constant');

const indexTpl = fs.readFileSync(path.join(__dirname, 'index.ejs'), 'utf-8');
const DEF_CDN_DOMAIN = 'https://unpkg.com';
let prefixUrl = localUnpkgPrefix;

function parse(conf){
  let lrClientJs, lrClientCss;
  if(!conf._dev){
    const clientMap = _getClientMap(conf);
    Object.assign(localUnpkgMap, clientMap);
    lrClientJs = clientMap.lrClientJs.url;
    lrClientCss = clientMap.lrClientCss.url;
  } else {
    lrClientJs = conf._dev;
  }

  let cdn = conf.cdn;
  let isAllCDN = false;
  if(cdn === true){
    prefixUrl = DEF_CDN_DOMAIN;
    isAllCDN = true;
  } else {
    cdn = cdn || Object.create(null);
  }
  

  const map = Object.create(null);
  let v;
  Object.keys(localUnpkgMap).forEach(k => {
    v = localUnpkgMap[k];
    if(isAllCDN){
      v.cdn = true;
      v.file = null;
      v.url = prefixUrl + v.url;
    } else {
      if(cdn[k]){
        v.cdn = true;
        v.file = null;
        v.url = _render(cdn[k], v.version);
      }
    }

    if(v.cdn){
      map[k] = v.url;
    } else {
      map[k] = prefixUrl + v.url;
    }
    
  })

  const loadJsArr = [];

  ['jquery', 'vue.runtime', 'vuex', 'vue-router', 'requirejs'].forEach(k => {
    loadJsArr.push(map[k]);
  });
  

  loadJsArr.push(lrClientJs);

  const requirePaths = Object.create(null);
  ['pako', 
  'xterm', 
  'xterm-addon-fit', 
  'xterm-addon-web-links', 
  'xterm-addon-attach', 
  'xterm.css'].forEach(k => {
    requirePaths[k] = map[k];
  });

  const CLIENT_CONFIG = {
    VERSION: conf._clientVersion
  }
  return {
    lrClientCss,
    loadJsArr,
    requirePaths,
    CLIENT_CONFIG
  }
}

function _render(tpl, value){
  return tpl.replace(/\{\{VERSION\}\}/g, value);
}

function _getClientMap(conf){
  return {
    lrClientCss: {
      url: wrapDistedUrl('linux-remote-client', conf._clientVersion, 'lr-client.min.css'),
      version: conf._clientVersion
    },
    lrClientJs: {
      url: wrapDistedUrl('linux-remote-client', conf._clientVersion, 'lr-client.min.js'),
      version: conf._clientVersion
    }
  }
}

function getIndex(conf){
  const data = parse(conf);
  return ejs.render(indexTpl, {data});
}

function getStaticMap(){
  const staticMap = Object.create(null);
  let v;
  Object.keys(localUnpkgMap).forEach(k => {
    v = localUnpkgMap[k];
    if(!v.cdn){
      staticMap[v.url] = getFilePathByUrl(v.url);
    }
  });
  return staticMap;
}

module.exports = {
  getIndex,
  getStaticMap
};