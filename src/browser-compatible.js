(function(){
  function getMajorByMark(mark){
    var ua = window.navigator.userAgent;
    var index = ua.indexOf(mark);
    if(index !== -1){
      ua = ua.substr(index + mark.length + 1);
      index = ua.indexOf('.');
      if(index !== -1){
        ua = ua.substr(0, index + 1);
        return Number(ua)
      }
    }
  }
  const compatibilityTable = [
    {
      mark: 'Chrome',
      min: 80
    },
    {
      mark: 'Firefox',
      min: 68
    }
  ]
  const len = compatibilityTable.length;
  let i = 0, item, version, isVersionNum, errMsg, isSuccess = false;
  for(; i < len; i++){
    item = compatibilityTable[i];
    version = getMajorByMark(item.mark);
    isVersionNum = typeof version === 'number';
    if(isVersionNum){
      if(version < item.min){
        errMsg = 'Browser version is too low, please upgrade to the latest.';
      } else {
        isSuccess = true;
      }
      break;
    }
  }
  if(!errMsg && !isSuccess){
    errMsg = 'For the time being, only Firefox and Chrome supported.';
  }
  if(errMsg){
    document.write('<h1>' + errMsg + '</h1>');
    throw errMsg;
  } else {
    document.write('<div id="lr-root">Loading...</div>');
  }
})();