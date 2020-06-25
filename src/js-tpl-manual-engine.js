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
