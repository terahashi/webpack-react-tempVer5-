//common.jsファイルとして出力される
//common.jsは「複数のファイルで共通して使う関数や変数」をまとめておくためのファイル
//例えば「ログを出力する関数」などをまとめておく

export default {
  log: function (str) {
    console.log(str);
  },
};
