# vue-todo-list
a todo-list develop with Vue

2.1 vue-loader+webpack项目配置
VS Code插件安装(有点多，安装自己了解的)
	• ESLint
		○ 先安插件
		○ 再执行命令：npm install -g eslint
		○ 在需要配置eslint的工程中执行eslint --init命令生成.eslintrc.js配置文件
	• gitignore
	• ……以后再了解（EditorConfig for VS Code、language-stylus(处理stylus)、Nunjucks、One Dark Pro、PostCSS syntax、Vetur、View in Browser、vscode-icons）

创建项目
	• npm init
		○ 一路回车最后Yes即可
	• npm i webpack vue vue-loader 
		○ 根据提示可能需要继续安装css-loader和vue-template-compiler
	• 创建src文件夹
		○ 创建app.vue
		<template>
		    <div id="test">{{text}}</div>
		</template>
		<script>
		export default {
		    data() {
		        return {
		            text: 'abc'
		        }
		    }
		}
		</script>
		<style>
		#test{
		    color: red;
		}
		</style>
		○ 创建index.js
		import Vue from 'vue'
		import App from './app.vue'
		
		const root = document.createElement('div')
		document.body.appendChild(root)
		new Vue({
		  render: (h) => h(App)
		}).$mount(root)
	• 创建webpack.config.js
		○ entry
		○ output
		○ module下的rules配置vue-loader
	• 修改package.json的"scripts"，新增：
		○ "build": "webpack --config webpack.config.js"
	• npm run build（注意，此时会报错，根据错误采取对应措施）
		○ vue-loader was used without the corresponding plugin. Make sure to include VueLoaderPlugin in your webpack config.
			§ 分析：参考官方文档 https://vue-loader.vuejs.org/migrating.html#a-plugin-is-now-required . Vue-loader在15.*之后的版本都是 vue-loader的使用都是需要伴生 VueLoaderPlugin的
			§ // webpack.config.js
			const VueLoaderPlugin = require('vue-loader/lib/plugin');
			module.exports = {
			    devtool: "sourcemap",
			    entry: './js/entry.js', // 入口文件
			    output: {
			        filename: 'bundle.js' // 打包出来的wenjian
			    },
			    plugins: [
			        // make sure to include the plugin for the magic
			        new VueLoaderPlugin()
			    ],
			    module : {
			    ...
			}
			}
		○ Module parse failed: Unexpected character '#' (16:0)
		File was processed with these loaders:
		 * ./node_modules/vue-loader/lib/index.js
		You may need an additional loader to handle the result of these loaders.
			§ webpack.config.js配置规则处理css(css-loader)
总结：
	• webpack作用就是把不同的静态资源类型打包成JS
	• 把零碎的JS打包到一起
	• 模块依赖，达成可复用性

2.2 webpack配置项目加载各种静态资源及css预处理器
配置处理css
	{
        test: /\.css$/,
        use: [
          'style-loader', // 以html形式插入
          'css-loader' // 提取出css文件
        ]
      }
配置处理图片
	{
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader', // 把图片转化为base64代码，直接写在js内容中而不用生成图片
            options: {
              limit: 1024, // 当文件小于limit，则进行base64代码转换
              name: '[name]-aaa.[ext]'
            }
          }
        ]
      }
	• 注意：需要安装style-loader和url-loader，即执行(file-loader是url-loader的依赖)：
		npm i style-loader url-loader file-loader
引用css和图片
	• 在src下建立assets/styles文件夹和assets/images文件夹，在assets/styles下新建test.css：
	body {
	  color: red;
	  background-image: url('../images/activity.svg')
	}
	• 在index.js中import：
	import './assets/styles/test.css'
	import './assets/images/header1.jpg'
	• build打包：
	npm run build
	在dist文件夹下出现header1-aaa.jpg和bundle.js
css预处理器(模块化处理css)
	• 配置webpack.config.js：
	{
	        test: /\.styl/,
	        use: [
	          'style-loader', // 写到html
	          'css-loader', // 需要处理css文件
	          'stylus-loader' // 专门处理stylus文件
	        ]
	      },
	• 在assets/styles文件夹新建test-stylus.styl：
	body
	  font-size 20px
	• 引用stylus：在index.js下新增：
	import './assets/styles/test-stylus.styl'
	• 安装stylus-loader(stylus是stylus-loader的依赖)：
	npm i stylus-loader stylus

2.3 webpack-dev-server的配置和使用
安装
	npm  i webpack-dev-server
配置
	• 修改package.json文件，在"scripts"下新增：
	"dev": "webpack-dev-server --config webpack.config.js"
	• 修改webpack.config.js文件：
	target: 'web'
	• cross-env，用于设置环境变量：
		○ 安装：npm i cross-env
		○ 配置，修改package.json文件的"scripts"项：
		"build": "cross-env NODE_ENV=production webpack --config webpack.config.js",
	     "dev": "cross-env NODE_ENV=development webpack-dev-server --config webpack.config.js"
		○ 在webpack.config.js中使用变量判断当前NODE_ENV：
		const isDev = process.env.NODE_ENV === 'development'
		○ 修改之前module.exports
		const config = {
		  target: 'web',
		  entry: path.join(__dirname, 'src/index.js'),
		  output: {
		    filename: 'bundle.js',
		    path: path.join(__dirname, 'dist')
		  },
		  module: {
			……
		
		module.exports = config
		当是开发模式时，触发if：
		if (isDev) {
		  config.devSever = { // webpack 2之后把关于webpack-dev-server的配置写到该项下
		    port: 8000,
		    host: '0.0.0.0', // 可以通过localhost或127.0.0.1来访问
		    overlay: {
		      errors: true, // webpack编译错误时显示在网页
		    }
		  }
		}
	• html-webpack-plugin，用于设置项目html入口：
		○ 安装：npm i html-webpack-plugin
		○ 配置，在webpack.config.js引入：
		const HTMLPlugin = require('html-webpack-plugin')
		……
		plugins: [
		    new VueLoaderPlugin(),
		    new HTMLPlugin()
		  ]
	• 增加webpack.DefinePlugin：
	const webpack = require('webpack')
	……
	plugins: [
	    new VueLoaderPlugin(),
	    new webpack.DefinePlugin({
	      'process.env': { // 该变量可以在JS代码调用
	        NODE_ENV: isDev ? '"development"' : '"production"'
	      }
	    }),
	    new HTMLPlugin()
	  ]
访问
	• npm run dev
	• 访问浏览器：localhost:8000
一些相关设置
	• 在webpack.config.js中：
	if (isDev) {   
	    config.devtool = '#cheap-module-eval-source-map' // webpack官方推荐sourceMap
	  config.devServer = { // webpack 2之后把关于webpack-dev-server的配置写到该项下
	    port: 8000,
	    host: '0.0.0.0', // 可以通过localhost或127.0.0.1来访问
	    overlay: {
	      errors: true, // webpack编译错误时显示在网页
	    },
	    hot: true, // 热更新：替换某个组件时，只渲染该组件，需要增加HotModuleReplacementPlugin
	    // historyFallback: { // 映射默认入口地址
	    // },
	    // open: true, // 自动打开浏览器
	  }
	  config.plugins.push(
	    new webpack.HotModuleReplacementPlugin(),
	    new webpack.NoEmitOnErrorsPlugin() // 减少一些不需要的信息展示
	  )
}
