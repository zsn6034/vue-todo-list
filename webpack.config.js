const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
// const ExtractPlugin = require('extract-text-webpack-plugin') // 将非JS文件单独打包成静态资源文件, webpack 4之后废弃
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isDev = process.env.NODE_ENV === 'development'

const config = {
  target: 'web',
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /.jsx$/,
        loader: 'babel-loader'
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //     'style-loader', // 以html形式插入
      //     'css-loader' // 提取出css文件
      //   ]
      // },
      // {
      //   test: /\.styl/,
      //   use: [
      //     'style-loader', // 写到html
      //     'css-loader', // 需要处理css文件
      //     {
      //       loader: 'postcss-loader',
      //       options: {
      //         sourceMap: true // 使用stylus-loader生成的sourceMap即可，不用再生成，加快编译
      //       }
      //     },
      //     'stylus-loader' // 专门处理stylus文件
      //   ]
      // },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader', // 把图片转化为base64代码，直接写在js内容中而不用生成图片
            options: {
              limit: 1024, // 当文件小于limit，则进行base64代码转换
              name: '[name]-aaa.[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': { // 该变量可以在JS代码调用
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    new HTMLPlugin()
  ]
}

if (isDev) {
  config.module.rules.push({
    test: /\.styl/,
    use: [
      'style-loader', // 写到html
      'css-loader', // 需要处理css文件
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true // 使用stylus-loader生成的sourceMap即可，不用再生成，加快编译
        }
      },
      'stylus-loader' // 专门处理stylus文件
    ]
  })
  config.devtool = '#cheap-module-eval-source-map' // webpack官方推荐sourceMap
  config.devServer = { // webpack 2之后把关于webpack-dev-server的配置写到该项下
    port: 8000,
    host: '0.0.0.0', // 可以通过localhost或127.0.0.1来访问
    overlay: {
      errors: true, // webpack编译错误时显示在网页
    },
    hot: true, // 热更新：替换某个组件时，只渲染该组件，需要增加HotModuleReplacementPlugin
    // historyFallback: { // 映射默认入口地址
    // },
    // open: true, // 自动打开浏览器
  }
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin() // 减少一些不需要的信息展示
  )
} else {
  config.entry = {
    app: path.join(__dirname, 'src/index.js'),
    vendor: ['vue']
  }
  config.output.filename = '[name].[chunkhash:8].js'
  config.module.rules.push(
    {
      test: /\.styl/,
      // use: ExtractPlugin.extract({
      //   fallback: 'style-loader',
      //   use: [
      //     'css-loader', // 需要处理css文件
      //     {
      //       loader: 'postcss-loader',
      //       options: {
      //         sourceMap: true // 使用stylus-loader生成的sourceMap即可，不用再生成，加快编译
      //       }
      //     },
      //     'stylus-loader' // 专门处理stylus文件
      //   ]
      // })
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: './',
            hmr: process.env.NODE_ENV === 'development' // 热模块重载，只有开发模式使用
          },
        },
        'css-loader',
        {
          loader: 'postcss-loader',
          options: { sourceMap: true }
        },
        'stylus-loader'
      ]
    }
  )
  // config.plugins.push(
  //   new ExtractPlugin('styles.[contenHash:8].css')
  // )
  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: 'styles.[chunkhash:8].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
    // new webpack.optimize.CommonsChunkPlugin({ // webpack 4废弃
    //   name: 'vendor'
    // })
    // new BundleAnalyzerPlugin(), // 显示包依赖
  )
  config.optimization = {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'vendor',
        }
      }
    },
    runtimeChunk: true // 为了运行时插入模块不影响id
  }
}

module.exports = config