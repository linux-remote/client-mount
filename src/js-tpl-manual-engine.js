// WTF: ejs 3 has AD.
// and ejs 1 was deprecated. 
// So

function jsTplManualEngine(data){
return `<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    ` + (!data.lrClientCss ? '' : `<link href="${data.lrClientCss}" rel="stylesheet" />`) + `
    <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEUAAABiir2aiBlxAAAAAXRSTlMAQObYZgAAATpJREFUaN7t2UGKwzAMBVCHWXjpI+QoOVp0NB/FR8jSC2MNiG5moP+7qIW2yIsEwoOAP5YUkpSsAAH+gZruri1AgAABAgQI8DjIquP2TG0NBrQxMBlQYaAx0BmYDCgFwkBloDFwMdAZGG4w3UAdQDIDyYQAkCg4GNgZKJY3ANkNftxgC/BEIDALN8grICFQGNhVJwQHA6fqgEAxsG3oCOwElKU62dy1Whhwd5zBwOVui+JtzZ2BykBzv2L4Bwz/BFIBEJaFFJKm2LFAwA4WBCcDdrjZ0fOBYlfSuyupDxw0BDbbawewa6dl0AcsDDaB+EB5/QxjYfwBtyWrwMJgoCOQGLAwGJgQHAtAIdjtDkBZARWBzICFwcCFwLYCOgJWxyA4F8BEwMJ4r8/qAAECBAjw6eAdfoAG+BrwC50Ht6IgJiNlAAAAAElFTkSuQmCC" />
    <title>Linux Remote</title>
  </head>
  <body>
    <script>!function(){var r={1:"For the time being, only Firefox and Chrome supported.",2:"Browser version is too low, please upgrade to the latest."};function e(r,e){if(null===e)return 1;if(r){if(e<80)return 2}else if(e<68)return 2}function n(r){var e=r.indexOf(".");return-1===e?Number(r):(e=r.substr(0,e),Number(e))}var t=function(t){var i,o=t.indexOf("Firefox");if(i=-1===o?-1===(o=t.indexOf("Chrome"))?1:e(!0,function(r,e){var t=r.substr(e+7);return(t=t.split(" ")).length>2?null:n(t[0])}(t,o)):e(!1,function(r,e){var t=r.substr(e+8);return(t=t.split(" ")).length>1?null:n(t[0])}(t,o)))return r[i]}(navigator.userAgent);if(t)throw document.write("<h1>"+t+"</h1>"),new Error(t);document.write('<div id="lr-root">Loading...</div>')}();</script>
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
