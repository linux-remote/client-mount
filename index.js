/*
  https://unpkg.com/ Sync of npm.
  https://cdnjs.com/ Version is may lag behind.
*/
const path = require('path');
const { localUnpkgPrefix, DEF_CDN_DOMAIN, CLIENT_PKG_NAME, OPEN_ICON_PKG_NAME } = require('./src/constant.js');
const indexRender = require('./src/index-render.js');

global.IS_PRO = process.env.NODE_ENV === 'production';

/* 
  opt: {cdn, 
        clientVersion, 
        CORS, 
        localunpkgdir?, 
        localunpkgVersion?,
         _devlrClientJs?
      }
*/
let indexHtmlChche;

function mount(app, eStatic, opt){
  // mount index;
  let pkgMap = require('./src/pkg-map.json');
  let prefixUrl;

  if(opt.cdn){
    prefixUrl = DEF_CDN_DOMAIN;
  } else {
    _checkLocalUnpkg(opt, pkgMap._self);
    prefixUrl = localUnpkgPrefix;
  }

  const indexData =  _formatPkgMap(opt, pkgMap, prefixUrl);
  app.get(/^\/($|user)/, _indexHandler(opt, indexData));

  if(!opt.cdn){
    const maxAge = global.IS_PRO ? 1000 * 60 * 60 * 24 * 365 : 0;
    let dirArr = [], filePkgMap = Object.create(null);
    let pkgItem;
    Object.keys(pkgMap).forEach(k => {
      pkgItem = pkgMap[k];
      let filePath =  pkgItem.url.replace('@' + pkgItem.version, '');
      filePath = path.join(opt.localunpkgdir, '.' + filePath);
      pkgItem.filePath = filePath;
      if(pkgItem.type === 'dir'){
        dirArr.push(pkgItem);
      } else {
        filePkgMap[pkgItem.url] = pkgItem.filePath;
      }
    });

    app.use(localUnpkgPrefix, function(req, res, next){
      if(req.method !== 'GET'){
        return next({status: 405});
      }
      const filePath = filePkgMap[req.url];
      if(filePath){
        res.sendFile(filePath, {
          maxAge
        });
      } else {
        next();
      }
    });

    dirArr.forEach(item => {
      console.log('\n\nlocalUnpkgPrefix + item.url', localUnpkgPrefix + item.url);
      console.log('item.filePath', item.filePath);
      console.log('\n\n')
      app.use(localUnpkgPrefix + item.url, eStatic(item.filePath, {
        maxAge
      }));
    });
  }
  
  pkgMap = null;
}

function _indexHandler(opt, indexData){
  let indexEtag;
  if(global.IS_PRO){
    indexEtag = opt.clientVersion;
  } else {
    indexEtag = 'dev_' + Date.now();
  }
  indexEtag = `W/"${indexEtag}"`;
  indexHtmlChche = indexRender(opt, indexData);
  return function index(req, res){
    if(req.get('If-None-Match') === indexEtag){
      res.status(304).end();
      return;
    }
    res.set('ETag', indexEtag);
    res.set('Cache-Control', 'public, max-age=0');
    res.set('X-Frame-Options', 'deny');
    res.type('html').end(indexHtmlChche);
  }
}


function _genClientMap(clientVersion){
  return {
    lrClientCss: {
      url: _wrapDistedUrl(CLIENT_PKG_NAME, clientVersion, 'lr-client.min.css'),
      version: clientVersion
    },
    lrClientJs: {
      url: _wrapDistedUrl(CLIENT_PKG_NAME, clientVersion, 'lr-client.min.js'),
      version: clientVersion
    }
  }
}

function _checkLocalUnpkg(opt, localUnpkgVersion){
  if(!opt.localunpkgdir){
    throw new Error('not have localunpkgdir');
  }
  if(opt.localunpkgVersion !== localUnpkgVersion){
    throw new Error('client-index localunpkg version ' + localUnpkgVersion + ' is Unmatched: ' + opt.localunpkgVersion);
  }
}

function _formatPkgMap(opt, pkgMap, prefixUrl){
  delete(pkgMap._self);
  const loadJsArr = [],
  amdMap = Object.create(null);
  let item, isJs
  Object.keys(pkgMap).forEach(k => {
    item = pkgMap[k];
    isJs = item.type === 'js';
    if(isJs){
      if(item.suffix){
        item.url = item.url + item.suffix;
      } else {
        if(global.IS_PRO){
          item.url = item.url + '.min.js';
        } else {
          item.url = item.url + '.js';
        }
      }
    }

    if(item.amd){
      amdMap[k] = prefixUrl + item.url;
    } else {
      if(isJs){
        loadJsArr.push(prefixUrl + item.url);
      }
    }
  });

  let lrClientJs, 
  lrClientCss;
  if(global.IS_PRO){
    const clientMap = _genClientMap(opt.clientVersion);
    Object.assign(pkgMap, clientMap);
    lrClientJs = pkgMap.lrClientJs.url;
    lrClientCss = pkgMap.lrClientCss.url;
  } else {
    lrClientJs = opt._devlrClientJs;
  }
  return {
    amdMap,
    loadJsArr,
    lrClientJs,
    lrClientCss,
    prefixUrl,
    OPEN_ICON_URL: prefixUrl + pkgMap[OPEN_ICON_PKG_NAME].url
  }
}

function _wrapDistedUrl(mName, version, fileName){
  return `/${mName}@${version}/dist/${fileName}`;
}

module.exports = mount;
