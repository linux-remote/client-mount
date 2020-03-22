/*
  https://unpkg.com/ Sync of npm.
  https://cdnjs.com/ Version is may lag behind.
*/

const { localUnpkgPrefix } = require('./src/constant.js');
const {getIndex, getStaticMap, OPEN_ICON} = require('./src/get-index.js');

function mount(app, conf){

  // mount index;
  let indexHtml = getIndex(conf);
  let indexEtag = `W/"${conf._clientVersion}"`;
  app.get(/^\/($|user)/, function(req, res){
    if(req.get('If-None-Match') === indexEtag){
      res.status(304).end();
      return;
    }
    res.set('ETag', indexEtag);
    res.set('Cache-control', 'public, max-age=0');
    res.set('X-Frame-Options', 'deny');
    res.type('html').end(indexHtml);
  });

  // mount static;
  const isLocal = (conf.host === 'localhost') || (conf.host === '127.0.0.1');
  const maxAge = isLocal ? 0 : 1000 * 60 * 60 * 24 * 365;
  const staticMap = getStaticMap();
  
  if(!OPEN_ICON.cdn){
    const openIconFilePath = staticMap[OPEN_ICON.url];
    delete(staticMap[OPEN_ICON.url]);
    // console.log('OPEN_ICON', OPEN_ICON, openIconFilePath);
    app.use(localUnpkgPrefix + OPEN_ICON.url, conf.eStatic(openIconFilePath, {
      maxAge
    }));
  }

  if(Object.keys(staticMap).length){
    app.use(localUnpkgPrefix, function(req, res, next){
      if(req.method !== 'GET'){
        return next({status: 405});
      }
      const filePath = staticMap[req.url];
      if(filePath){
        res.sendFile(filePath, {
          maxAge
        });
      }
    });
  }
}

module.exports = mount;
