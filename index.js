// ['jquery', 'vue.runtime', 'vuex', 'vue-router', 'require', 'lrCl']
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
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
module.exports = {
  clientIndex,
  isLocalClient,
  isLocalIcon,
  isLocalPublic
};
