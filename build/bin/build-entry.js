const Components = require('../../components.json');
const fs = require('fs');
const render = require('json-templater/string');
const upperCamelCase = require('uppercamelcase');
const path = require('path');
const endOfLine = require('os').EOL;
const OUTPUT_PATH = path.join(__dirname, '../../src/index.js');
const IMPORT_TEMPLATE = 'import {{name}} from \'../packages/{{package}}/index.js\';';
const INSTALL_COMPONENT_TEMPLATE = '  {{name}}';
const MAIN_TEMPLATE = `/* Automatically generated by './build/bin/build-entry.js' */

{{include}}
import locale from './src/locale';
import CollapseTransition from './src/transitions/collapse-transition';

const components = [
{{install}}
  CollapseTransition,
];

const install = function(Vue, opts = {}) {
  locale.use(opts.locale);
  locale.i18n(opts.i18n);
  
  components.forEach(component => {
    Vue.component(component.name, component);
  });
  
  Vue.use(InfiniteScroll);
  Vue.use(Loading.directive);
  
  Vue.prototype.$ABLESON = {
    size: opts.size || 'small',
    transfer: 'transfer' in opts ? opts.transfer : '',
    zIndex: opts.zIndex || 2000
  };
  
  Vue.prototype.$loading = Loading.service;
  Vue.prototype.$msgbox = ConfirmBox;
  Vue.prototype.$alert = ConfirmBox.alert;
  Vue.prototype.$confirm = ConfirmBox.confirm;
  Vue.prototype.$prompt = ConfirmBox.prompt;
  Vue.prototype.$notify = Notice;
  Vue.prototype.$message = Message;
  
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  version: '{{version}}',
  locale: locale.use,
  i18n: locale.i18n,
  install,
  Loading,
  CollapseTransition,
{{list}}
};
`;

delete Components.font;

let ComponentNames = Object.keys(Components);
let includeComponentTemplate = [];
let installTemplate = [];
let listTemplate = [];

ComponentNames.forEach(name => {
  let componentName = upperCamelCase(name);

  includeComponentTemplate.push(render(IMPORT_TEMPLATE, {
    name: componentName,
    package: name
  }));

  if (['Loading', 'ConfirmBox', 'Notice', 'Message'].indexOf(componentName) === -1) {
    installTemplate.push(render(INSTALL_COMPONENT_TEMPLATE, {
      name: componentName,
      component: name
    }));
  }

  if (componentName !== 'Loading') listTemplate.push(`  ${componentName}`);
})

let template = render(MAIN_TEMPLATE, {
  include: includeComponentTemplate.join(endOfLine),
  install: installTemplate.join(',' + endOfLine),
  version: process.env.VERSION || require('../../package.json').version,
  list: listTemplate.join(',' + endOfLine)
});

fs.writeFileSync(OUTPUT_PATH, template);
