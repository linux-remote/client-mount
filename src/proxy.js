/*
  Browser CORS status: 
  A cookie associated with a cross-site resource at http://localhost/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032. cookies-without-same-site-must-be-secure
  So use proxy.
*/

const httpProxy = require('http-proxy');
const SID_MARK = 'lr_sid=';

function createProxy(conf){
  const opt = {
    target: conf.target,
  };
  if(conf.secure){
    opt.ssl = conf.secure
  }

  const proxy = httpProxy.createServer(opt);

  proxy.on('proxyReq', cookieFilter);
  proxy.on('proxyReqWs', function(){
    console.log('proxyReqWs');
  });

  return proxy;
};

function cookieFilter(proxyReq, req){
  // proxyReq args: proxyReq, req, res, options
  // proxyReqWs args: proxyReq, req, socket, options, head
  const sidCookie = _getSidCookie(req.headers['cookie']);
  proxyReq.setHeader('Cookie', sidCookie);
}

function _getSidCookie(cookie){
  let i = cookie.indexOf(SID_MARK);
  if(i === -1){
    return [];
  }
  let str = cookie.substr(i);
  i = str.indexOf(';');
  if(i !== -1){
    str = str.substr(0, i);
  }
  return [str];
}

module.exports = createProxy;
