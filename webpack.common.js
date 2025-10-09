const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = ({ outputFile, assetFile }) => ({
  entry: './src/main.jsx', // React用に変更
  output: {
    path: path.resolve(__dirname, 'dist'), //「dist」を出力先フォルダにする
    filename: `${outputFile}.js`,
    chunkFilename: `${outputFile}.js`, //vendor.jsとcommon.jsの分割されたファイル用
    clean: true, //distフォルダを一度削除してからビルドする
  },
  module: {
    rules: [
      {
        test: /\.(m?js|jsx?)$/, //⬅︎.js .mjs .jsxにマッチする正規表現
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

  //⬇︎react用に追加
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // node_modules 内を vendors.js に分離
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
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
