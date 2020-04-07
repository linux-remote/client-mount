// WTF: ejs 3 has AD.
// and ejs 1 was deprecated. 
// So

function jsTplManualEngine(data){
return `<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    ` + (!data.lrClientCss ? '' : `<link href="${data.lrClientCss}" rel="stylesheet" />`) + `
    <title>Linux Remote</title>
  </head>
  <body>
    <div id="lr-root">Loading...</div>
    ` + (data.loadJsArr.map(function(src){
      return `<script src="${src}"></script>`
    }).join('\n    ')) + `
    <script>
    var CLIENT_CONFIG = ${JSON.stringify(data.CLIENT_CONFIG)};
    window.require.setMap(${JSON.stringify(data.amdMap)});
    </script>
    <script src="${data.lrClientJs}"></script>
  </body>
</html>`;
}

module.exports = jsTplManualEngine;
