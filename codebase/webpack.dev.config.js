const webpack = require('webpack');
const path = require('path');

const sourcePath = path.join(__dirname, './src');
const staticsPath = path.join(__dirname, './static');

module.exports = function (env) {
  const nodeEnv = env && env.prod ? 'production' : 'development';
  const isProd = nodeEnv === 'production';

  const plugins = [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.bundle.js',
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: nodeEnv,
    }),
    new webpack.NamedModulesPlugin(),
  ];

  if (isProd) {
    plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          screw_ie8: true,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
        },
        output: {
          comments: false,
        },
      })
    );
  } else {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return {
    devtool: isProd ? 'inline-source-map' : 'eval',
    context: sourcePath,
    entry: {
      html: './examples/gltf-model/index.html',
      js: [
        'webpack-dev-server/client?http://localhost:5555',
        'webpack/hot/only-dev-server',
        './examples/gltf-model/index.js',
      ],
    },
    output: {
      path: staticsPath,
      filename: '[name].bundle.js',
      publicPath: 'http://localhost:3000/',
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: {
            loader: 'file-loader',
            query: {
              name: '[name].[ext]',
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.pcss$/,
          // exclude: /node_modules/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.glsl$/,
          exclude: /node_modules/,
          use: [
            'raw-loader',
            'glslify-loader',
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            'babel-loader',
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
      modules: [
        path.resolve(__dirname, 'node_modules'),
        sourcePath,
      ],
    },

    node: {
      fs: 'empty',
    },

    plugins,

    performance: isProd && {
      maxAssetSize: 100,
      maxEntrypointSize: 300,
      hints: 'warning',
    },

    stats: {
      colors: {
        green: '\u001b[32m',
      },
    },

    devServer: {
      contentBase: staticsPath,
      publicPath: '/',
      historyApiFallback: true,
      host: '0.0.0.0',
      port: 5555,
      compress: isProd,
      // inline: true,
      hot: isProd,
      watchOptions: {
        aggregateTimeout: 1000,
        poll: 1000,
      },
      stats: {
        assets: true,
        children: false,
        chunks: false,
        hash: false,
        modules: false,
        publicPath: false,
        timings: true,
        version: false,
        warnings: true,
        colors: {
          green: '\u001b[32m',
        },
      },
    },
  };
};
