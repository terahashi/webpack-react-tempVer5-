import 'js/sub';
import '@scss/app.scss';

import jQuery from 'jquery';
import utils from './utils';

// setTimeout(() => {
//   import('@scss/app');
// }, 2000);

console.log('Hello, app.js Webpack 5 OKKKK!');

const init = async () => {
  await asyncFn();
  jQuery();
  utils.log('hello app.js(utils/index.js)'); //⬅︎utilsフォルダのindex.jsのlog関数を実行
};

const init2 = () => {
  console.log('hello init2');
};

async function asyncFn() {
  console.log([1, 2, 3].includes(0));
}

init();
init2();
