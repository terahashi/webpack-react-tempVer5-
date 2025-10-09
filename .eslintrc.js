module.exports = {
  root: true, //このファイルをプロジェクトのルートESLint設定として扱う
  parser: '@babel/eslint-parser', //Babelで解析する
  parserOptions: {
    babelOptions: {
      presets: ['@babel/preset-env'], //BabelでES6+を変換するプリセットを指定
    },
    ecmaVersion: 2025, //ECMAScriptのバージョン
    sourceType: 'module', // "script" or "module" (ESModulesを使うなら'module'。import/export を使う)
    requireConfigFile: false, //⬅︎Babel設定ファイルなしでもESLintが動く。小規模プロジェクトやBabel設定を別途作らない場合に役立つ。
  },
  env: {
    browser: true, // ブラウザ環境のグローバル変数を許可（windowなど
    node: true, // Node.js環境のグローバル変数を許可（global, processなど）
    es6: true, // ES6のグローバル変数や構文を許可（let, constなど）
  },
  extends: [
    'eslint:recommended', // ESLint推奨ルール
    'airbnb-base', // Airbnbベースルール
  ],
  globals: {
    utils: 'readonly', // utils変数を読み取り専用として許可
    jQuery: 'readonly', // jQuery変数を読み取り専用として許可
    $: 'readonly', // $変数を読み取り専用として許可（jQuery用）
  },
  plugins: ['import'], //import文の正当性チェック用プラグインを使用。存在しないファイルをimportした場合に「警告」を出す
  rules: {
    semi: ['error', 'always'], //セミコロンを必須にする
    'no-undef': 'off', //グローバル変数を定義しているので、'no-undef'を'off'にする
    'no-console': 'off', //'off'でconsole.logを使っても警告やエラーが出ない
    'no-debugger': 'warn', //debuggerを使うと警告「warn」が出る。debuggerは開発中は便利だが、本番ビルドに残すのはダメなので「'no-debugger':'error'にして【jsファイル内のdebugger;を手動で削除する】」
    'no-unused-vars': 'error', // 宣言したけど使っていない変数があるとエラー。
  },
};
