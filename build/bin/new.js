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
  }, {
    filename: 'src/index.vue',
    content: `<template>
    <div class="ab-${englishName}"></div>
</template>

<script>
  export default {
    name: 'Ab${ComponentName}'
  }
</script>`
  }, {
    filename: path.join('../../examples/docs/zh-CN', `${englishName}.md`),
    content: `## ${ComponentName} ${chineseName}`
  }, {
    filename: path.join('../../examples/docs/en-US', `${englishName}.md`),
    content: `## ${ComponentName}`
  }, {
    filename: path.join('../../examples/docs/es', `${englishName}.md`),
    content: `## ${ComponentName}`
  }, {
    filename: path.join('../../examples/docs/fr-FR', `${englishName}.md`),
    content: `## ${ComponentName}`
  }, {
    filename: path.join('../../packages/theme-chalk/src', `${englishName}.scss`),
    content: `@import "mixins/mixins";
@import "common/var";

@include b(${englishName}) {
}`
  }, {
    filename: path.join('../../types', `${englishName}.d.ts`),
    content: `import { AblesonUIComponent } from './component'

/** ${ComponentName} Component */
export declare class Ab${ComponentName} extends AblesonUIComponent {
}`
  }
]

// 添加到 components.json
const componentsFile = require('../../components.json');
if (componentsFile[englishName]) {
  console.error(`${englishName} 已存在.`);
  process.exit(1);
}
componentsFile[englishName] = `./packages/${englishName}/index.js`;
fileSave(path.join(__dirname, '../../components.json'))
  .write(JSON.stringify(componentsFile, null, '  '), 'utf8')
  .end('\n');

// 添加到 index.scss
const sassPath = path.join(__dirname, '../../packages/theme-chalk/src/index.scss');
const sassImportText = `${fs.readFileSync(sassPath)}@import "./${englishName}.scss";`;
fileSave(sassPath)
  .write(sassImportText, 'utf8')
  .end('\n');

// 添加到 index.d.ts
const elementTsPath = path.join(__dirname, '../../types/index.d.ts');

let elementTsText = `${fs.readFileSync(elementTsPath)}
/** ${ComponentName} Component */
export class ${ComponentName} extends Ab${ComponentName} {}`;

const index = elementTsText.indexOf('export') - 1;
const importString = `import { Ab${ComponentName} } from './${englishName}'`;

elementTsText = elementTsText.slice(0, index) + importString + '\n' + elementTsText.slice(index);

fileSave(elementTsPath).write(elementTsText, 'utf8').end('\n');

// 创建 package
Files.forEach(file => {
  fileSave(path.join(PackagePath, file.filename))
    .write(file.content, 'utf8')
    .end('\n');
});

process.on('exit', () => {
  console.log("exit");
});
