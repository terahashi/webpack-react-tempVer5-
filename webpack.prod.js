const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { merge } = require('webpack-merge');
const commonConf = require('./webpack.common.js');

const outputFile = '[name].[contenthash]'; //jsファイルやcssファイルにハッシュを付ける
const assetFile = '[contenthash]'; //imagesの画像のファイル名

module.exports = () =>
  merge(commonConf({ outputFile, assetFile }), {
    mode: 'production',
    // output: {
    //   filename: '[name].js', //⬅︎【テスト用】prod本番環境で「jsファイル名を[name]だけにする」
    // },

    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        inject: 'body',
        chunks: ['app'], //app.jsだけを読み込む
        minify: {
          collapseWhitespace: true, // HTML内の不要な空白や改行を削除し、ファイルサイズを縮小する
          keepClosingSlash: true, // <br/> や <img/> のように閉じスラッシュを維持する（XHTML互換性のため）
          removeComments: true, // productionなどの本番ビルドでは <!-- コメント --> をすべて削除する
          removeRedundantAttributes: true, // 既定値の属性を削除する（例: <input type="text"> → <input>）
          removeScriptTypeAttributes: true, // <script type="text/javascript"> の "type" 属性を削除（HTML5では不要）
          removeStyleLinkTypeAttributes: true, // <link rel="stylesheet" type="text/css"> の "type" 属性を削除（HTML5では不要）
          useShortDoctype: true, // <!DOCTYPE html> に短縮（古い形式 <!DOCTYPE HTML PUBLIC ...> を使わない）
        },
      }),

      new HtmlWebpackPlugin({
        template: './src/other.html',
        filename: 'other.html',
        inject: 'body',
        chunks: ['sub'], //sub.jsだけを読み込む
        minify: {
          collapseWhitespace: true, // HTML内の不要な空白や改行を削除し、ファイルサイズを縮小する
          keepClosingSlash: true, // <br/> や <img/> のように閉じスラッシュを維持する（XHTML互換性のため）
          removeComments: true, // productionなどの本番ビルドでは <!-- コメント --> をすべて削除する
          removeRedundantAttributes: true, // 既定値の属性を削除する（例: <input type="text"> → <input>）
          removeScriptTypeAttributes: true, // <script type="text/javascript"> の "type" 属性を削除（HTML5では不要）
          removeStyleLinkTypeAttributes: true, // <link rel="stylesheet" type="text/css"> の "type" 属性を削除（HTML5では不要）
          useShortDoctype: true, // <!DOCTYPE html> に短縮（古い形式 <!DOCTYPE HTML PUBLIC ...> を使わない）
        },
      }),
    ],

    optimization: {
      minimize: true, // ミニファイ有効化
      minimizer: [
        new CssMinimizerPlugin(), // 「CSSファイル」をミニファイ化
        new TerserPlugin({
          terserOptions: {
            //「terserOptions」とはTerserに渡す設定
            compress: {
              drop_console: true, // console.logを削除（任意）
              drop_debugger: true, // debugger を削除
              unused: true, // 使われていない変数・関数を削除
            },
          },
        }),
      ],
    },
  });
