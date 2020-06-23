// URL like: unpkg.com/:package@:version/:file
const { wrapDistedUrl } = require('./util');

function genMap(deps){
  
const map = Object.create(null);

// xterm@4.3.0 not dist folder.
// main is /lib/xterm.js mined
function getXtermFromLib(name){
  map[name] = {
    url: `/${name}@${deps[name]}/lib/${name}`,
    amd: true,
    suffix: '.js',
    version: deps[name],
    type: 'js'
  }
};

function genXterms(){
  ['xterm', 
  'xterm-addon-fit'].forEach(name => {
    getXtermFromLib(name);
  });
}

// xterm.css need after genXterms
function genXtermCss(){
  const xtermUrlPrefix = '/xterm@' + deps.xterm;
  map['xterm.css'] = {
    url: xtermUrlPrefix + '/css/xterm.css',
    type: 'css',
    amd: true,
    version: deps.xterm
  };
}


function genDisted(v){
  // https://stackoverflow.com/questions/38908243/cannot-read-property-foreach-of-undefined
  [
    'jquery', 
    { name: 'vue.runtime', mName: 'vue', file: 'vue.runtime' }, 
    'vuex',
    'vue-router', 
    { name: 'amd_ef', mName: 'amd_ef', suffix: '.min.js' },
    { name: 'pako', amd: true}

  ].forEach(v => {
    // all in the dist folder: ...jquery\dist\jquery.js
    let name, file, mName, suffix, isAmd;
    if(typeof v === 'string'){
      name = v;
      mName = v;
      file = v;
    } else {
      name = v.name;
      mName = v.mName || name;
      file = v.file || v.name;
      suffix = v.suffix;
      isAmd = v.amd;
    }
    map[name] = {
      url: wrapDistedUrl(mName, deps[mName], file),
      version: deps[mName],
      type: 'js',
      suffix,
      amd: isAmd
    }
  });
}

function genOpenIconDir(){
  const name = '@linux-remote/open-icon';
  map[name] = {
    url: `/${name}@${deps[name]}/icons/`,
    version: deps[name],
    type: 'dir'
  };
}


genDisted();
genXterms();
genXtermCss();
genOpenIconDir();

return map;
}

module.exports = genMap;
