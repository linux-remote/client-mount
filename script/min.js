const fs = require('fs');
const path = require('path');

const { minify } = require("terser");

const jsPath = path.join(__dirname, '../src/browser-compatible.js');
const jsContent = fs.readFileSync(jsPath, 'utf-8');
const tplPath = path.join(__dirname, '../src/js-tpl-manual-engine.js');
let tplContent = fs.readFileSync(tplPath, 'utf-8');


const result = minify(jsContent, {sourceMap: false}).then(result => {

  tplContent = tplContent.replace(/\/\* B_C_M_START \*\/ `([\s\S]*?)` \/\* B_C_M_END \*\//, 
  "/* B_C_M_START */ `" + result.code + "` /* B_C_M_END */");
  // BROWSER_COMPLTIBLE_MIN_END")
  fs.writeFileSync(tplPath, tplContent)
});

