/*
  Browser CORS status: 
  A cookie associated with a cross-site resource at http://localhost/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032. cookies-without-same-site-must-be-secure
  So use reverse proxy.

  https://unpkg.com/ Sync of npm.
  https://cdnjs.com/ Version is may lag behind.
*/
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const httpProxy = require('http-proxy');
const { parse } = require('./src/parse');

function clientIndex(clientConf, serverCORS, callback){
  let ejsOptions = Object.create(null);
  clientConf.cdn = clientConf.cdn || Object.create(null);
  if(serverCORS){
    ejsOptions.data = {
      serverCORS
    }
    _render(ejsOptions, callback);
    return;
  }

  parse(clientConf, function(err, data){
    if(err){
      return callback(err);
    }
    ejsOptions.data = data;
    _render(ejsOptions, function(err, html){
      if(err){
        return callback(err);
      }
      callback(null, html);
    })
  });
}

function _render(ejsOptions, callback){
  fs.readFile(path.join(__dirname, 'src/index.ejs'), 'utf-8', function(err, tpl){
    if(err){
      return callback(err);
    }
    callback(null, ejs.render(tpl, ejsOptions))
  });
}
function isLocalClient(cdn){
  return cdn.LRClientPages === undefined;
}
function isLocalIcon(cdn){
  return cdn.LRIconUrl === undefined;
}
function isLocalPublic(cdn){
  let i = 0, arr = Object.create(cdn), len = arr.length;
  for(; i < len; i++){
    if(cdn[arr[i]].indexOf('/public/') === 0){
      return true;
    }
  }
  return false;
}

// express mid
function indexMid(clientConf, serverCORS){
  let indexCache;
  return function(req, res, next){
    if(indexCache){
      return res.type('html').send(indexCache);
    }
    clientIndex(clientConf, serverCORS, function(err, html){
      if(err){
        return next(err);
      }
      indexCache = html;
      res.type('html').send(indexCache);
    })
  }
}
module.exports = {
  clientIndex,
  isLocalClient,
  isLocalIcon,
  isLocalPublic,
  indexMid
};
