// postcss在生成css文件后再进行的优化
const autoprefixer = require('autoprefixer')

module.exports = {
  plugins: [
    autoprefixer() // 对需要加浏览器前缀的css属性进行优化
  ]
}