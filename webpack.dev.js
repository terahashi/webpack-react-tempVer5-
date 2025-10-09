const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const commonConf = require('./webpack.common.js');

const outputFile = '[name]'; //jsファイルやcssファイルにハッシュを付ける
const assetFile = '[name]'; //imagesの画像のファイル名

module.exports = () =>
  merge(commonConf({ outputFile, assetFile }), {
    mode: 'development',
    devtool: 'source-map',
    // output: {
    //   filename: '[name].[contenthash].js', //⬅︎【テスト用】dev環境で「jsファイル名に[contenthash]を付けてみる」
    // },

    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        inject: 'body',
        chunks: ['app'], //app.jsと「app.jsに関連付けられたファイル」だけを読み込む
      }),
      new HtmlWebpackPlugin({
        template: './src/other.html',
        filename: 'other.html',
        inject: 'body',
        chunks: ['sub'], //sub.jsと「sub.jsに関連付けられたファイル」を読み込む
      }),
    ],

    devServer: {
      static: {
        directory: path.join(__dirname, 'public'), //開発サーバー(webpack-dev-server)が配信する「静的ファイルの場所」を指定
      },
      devMiddleware: { writeToDisk: true }, //開発サーバーでビルドしたファイルを「publicフォルダに出力」する
      watchFiles: {
        paths: ['src/'], //watchFilesは【指定したファイルやフォルダを監視し変更があったら「自動で再ビルド/リロードする」監視する対象のこと】
        options: {
          ignored: /node_modules/, //監視から除外するパスやファイル
        },
      },
      port: 3000,
      open: true,
    },
  });
