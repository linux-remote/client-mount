function wrapDistedUrl(mName, version, fileName){
  return `/${mName}@${version}/dist/${fileName}`;
}

module.exports = {
  wrapDistedUrl
}