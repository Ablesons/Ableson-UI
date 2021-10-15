'use strict';
/**
 * @Description: 创建组件指令文件
 * @Author: Ableson
 * @Date: 2021/10/15 17:31
 * @LastEditors: Ableson
 * @LastEditTime: 2021/10/15 17:31
 */
console.log("access");
if (!process.argv[2]) {
  console.error('[组件名]必填 - Please enter new component name');
  process.exit(1);
}
const path = require('path');
const fs = require('fs');
const fileSave = require('file-save');
const upperCamelCase = require('uppercamelcase');
const englishName = process.argv[2];
const chineseName = process.argv[3] || englishName;
const ComponentName = upperCamelCase(englishName);
const PackagePath = path.resolve(__dirname, '../../packages', englishName);
const Files = [
  {
    filename: "index.js",
    content: `import ${ComponentName} from './src/index';
    /* istanbul ignore next */
    ${ComponentName}.install = function(Vue) {
      Vue.component(${ComponentName}.name, ${ComponentName});
    };
    export default ${ComponentName};`
  }, {}
]
process.on('exit', () => {
  console.log("exit");
});
