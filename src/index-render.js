const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// opt: {cdn, CORS, clientVerison}

// return: lrClientCss,lrClientJs, amdMap, loadJsArr,  CLIENT_CONFIG, prefixUrl;
function parse(opt, indexData){

  const CLIENT_CONFIG = {
    IS_PRO: global.IS_PRO,
    VERSION: opt.clientVersion,
    CORS: opt.CORS,
    OPEN_ICON_URL: indexData.OPEN_ICON_URL
  }

  return {
    lrClientCss: indexData.lrClientCss,
    CLIENT_CONFIG,
    lrClientJs: indexData.lrClientJs,
    loadJsArr: indexData.loadJsArr,
    amdMap: indexData.amdMap
  }
}


function render(opt, indexData){
  const data = parse(opt, indexData);
  const indexTpl = fs.readFileSync(path.join(__dirname, 'index.ejs'), 'utf-8');
  return ejs.render(indexTpl, {data});
}

module.exports = render;