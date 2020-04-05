const jsTplManualEngine = require('./js-tpl-manual-engine.js');

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
    prefixUrl: indexData.prefixUrl,
    lrClientJs: indexData.lrClientJs,
    loadJsArr: indexData.loadJsArr,
    amdMap: indexData.amdMap
  }
}


function render(opt, indexData){
  const data = parse(opt, indexData);
  return jsTplManualEngine(data);
}

module.exports = render;