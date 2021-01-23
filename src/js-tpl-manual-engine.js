// WTF: ejs 3 has AD.
// and ejs 1 was deprecated. 
// So

const browserCompltibleMinJs = /* B_C_M_START */ `!function(){function e(e){var r=window.navigator.userAgent,o=r.indexOf(e);if(-1!==o&&-1!==(o=(r=r.substr(o+e.length+1)).indexOf(".")))return r=r.substr(0,o+1),Number(r)}const r=[{mark:"Chrome",min:80},{mark:"Firefox",min:68}],o=r.length;let t,i,n,m,a=0,d=!1;for(;a<o;a++)if(t=r[a],i=e(t.mark),n="number"==typeof i,n){i<t.min?m="Browser version is too low, please upgrade to the latest.":d=!0;break}if(m||d||(m="For the time being, only Firefox and Chrome supported."),m)throw document.write("<h1>"+m+"</h1>"),m;document.write('<div id="lr-root">Loading...</div>')}();` /* B_C_M_END */;

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
    <script>${browserCompltibleMinJs}</script>
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
