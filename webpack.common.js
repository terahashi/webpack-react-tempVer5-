const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = ({ outputFile, assetFile }) => ({
  entry: { app: 'js/app.js', sub: 'js/sub.js' },
  output: {
    path: path.resolve(__dirname, 'dist'), //「dist」を出力先フォルダにする
    filename: `${outputFile}.js`,
    chunkFilename: `${outputFile}.js`, //vendor.jsとcommon.jsの分割されたファイル用
    clean: true, //distフォルダを一度削除してからビルドする
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          // process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          //⬆︎上記の意味は　本番ビルドではMiniCssExtractPluginを使い、開発中はstyle-loaderでHotReloadを利用する

          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader', //⬅︎css
        ],
      },
      {
        test: /\.(jpe?g|gif|png|svg|woff2?|ttf|eot)$/,
        type: 'asset/resource', //⬅︎file-loaderの代わり。file-loaderはwebpack5では非推奨
        generator: {
          filename: `images/${assetFile}[ext]`, //出力先はimages。
          //publicPath: 'https://', //CDNやブラウザから参照するときのパス
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              sources: {
                list: [
                  '...', //⬅︎['...']と書くと「デフォルト設定を引き継ぐ」という意味。「例えばデフォルトでは含まれるものは<img src="..."> <link href="...">など。
                  {
                    tag: 'img', //対象にする「HTMLタグ名(この場合はimgタグ)」を指定
                    attribute: 'src', //そのimgタグの「どの属性を解決するか」を指定
                    type: 'src', //その属性値をどう解釈するかを指定する。「src」の場合はリソースのパスとして扱いwebpackに渡す(例:画像ファイル)
                  },
                ],
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin(
      { filename: `${outputFile}.css` } //⬅︎cssのファイル名が「◯◯.css」になる。
      // { filename: '[name].css' } //⬅︎cssのファイル名が「app.css」になる。
    ),
    new ESLintPlugin({
      extensions: ['js'],
      emitWarning: true,
      failOnError: false, //trueにするとエラーでビルド停止
      fix: true, //fixの自動修正を有効化
    }),
  ],

  optimization: {
    splitChunks: {
      chunks: 'all', //「all」は同期・非同期の両方に分割を適用。「async」は非同期のみ。「initial」は同期のみ。
      minSize: 0,
      cacheGroups: {
        // サードパーティ用（例:jQueyなど）
        vendors: {
          name: 'vendors', //vendorsという名前で出力 index.htmlに<script defer src="vendors.js">と読み込まれる
          test: /[\\/]node_modules[\\/]/, //node_modulesフォルダ内のモジュールを対象。「jQueryなどがvendorsに入る」
          priority: -10, //優先度。数値が大きいほど優先される
          chunks: 'all',
        },

        // 共通モジュール用(common.jsとして出力される。自作コードをまとめて1つのファイルに出力する仕組み)
        common: {
          minChunks: 2, // あるファイルが(例えば(utils/index.js)が2つ以上使われたら発動し「まとめてcommon.jsのファイルに出力する」
          name: 'common', // 出力ファイル名はcommon.js
          priority: -20,
          chunks: 'all',
        },
        default: false, //⬅︎デフォルトのキャッシュグループが無効になる
      },
    },
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'], //importするときに、拡張子を省略できるようにする
    alias: {
      '@scss': path.resolve(__dirname, 'src/scss'), //scssフォルダを「@scss」で指定できるようにする
      '@images': path.resolve(__dirname, 'src/images'), //imagesフォルダを「images」で指定できるようにする
    },
    modules: [path.resolve(__dirname, 'src'), 'node_modules'], //importするときに「srcフォルダ」も「node_modulesフォルダ」も両方参照するようにする
  },
});
