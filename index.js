/*
  Browser CORS status: 
  A cookie associated with a cross-site resource at http://localhost/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032. cookies-without-same-site-must-be-secure
  So use reverse proxy.

  https://unpkg.com/ Sync of npm.
  https://cdnjs.com/ Version is may lag behind.
*/

const { localUnpkgPrefix } = require('./src/constant.js');
const {getIndex, getStaticMap} = require('./src/get-index.js');

function mount(app, conf){

  // mount index;
  let indexHtml = getIndex(conf);
  app.get('/', function(req, res){
    res.type('html').end(indexHtml);
  });

  // mount static;
  const isLocal = (conf.host === 'localhost') || (conf.host === '127.0.0.1');
  const maxAge = isLocal ? 0 : 1000 * 60 * 60 * 24 * 365;
  const staticMap = getStaticMap();
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
