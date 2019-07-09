


// webpack 基本配置文件  



console.log("webpack");

// 声明入口 出口  
// 模块打包  
// js
// css/less/scss
// png
// react 预编译 
// app.vue 单文件组件  打包 
const webpack = require("webpack");
const path = require("path");  // 无需安装  node 内置模块  url / querystring 
const htmlWebpackPlugin = require("html-webpack-plugin");
const openBrowserWebpackPlugin =  require("open-browser-webpack-plugin");
const extractTextWebpackPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry:["./src/main.js"], //设置入口文件
    output:{
        path:path.resolve(__dirname,"dist"),  // resolve 正确处理 拼接 根路径
        filename:"js/[name].[hash:8].js" ,  // hash:8 以md5 模式加密 生成长度为 8  随机字符串  防止缓存 
        publicPath:"",   // 公共路径   上线需要设置的相对路径 
    },

    devtool:"source-map",  // 方便在线调试 代码 debugger 
    resolve:{
        alias:{ //设置别名
            "@":path.resolve('src'),
            "&":path.resolve('src/utils/'),
            "~":path.resolve('src/scripts/')
        }
    },
    module:{
        rules:[
            {
                test:/\.js|jsx/, //js、jsx处理打包
                exclude:/node_modules/,
                use:['babel-loader']
            },
            {
                test:/\.(png|jpg|gif|svg|woff|woff2|eot|ttf)$/, //图片打包处理
                use:[
                    {
                        loader:'url-loader',    //路径模块加载器
                        options:{   //图片参数选项
                            limit:8192, //允许最大为8M的图片(1024*8)
                            name:"imgs/[name].[hash:8].[ext]",//图片命名 例：1.jpg ==>1.sadd1234.jpg
                        }
                    }   
                ]
            },
            {
                test:/\.(css|scss)$/,
                use:extractTextWebpackPlugin.extract({  //extract css样式抽离
                    fallback:"style-loader", //编译后用什么loader来提取css文件
                    use: ["css-loader",
                        {
                            loader:"postcss-loader", //css代码转码在 JS 交给插件处理
                            options:{
                                plugins:function(){
                                    return[
                                        require("cssgrace"), //css代码样式美化
                                        require("autoprefixer"), //自动补齐兼容
                                        require("postcss-px2rem-exclude")( //适配
                                            {
                                                remUnit:100,
                                                exclude:/antd-mobile/i
                                            }
                                        )
                                    ]
                                }
                            }
                        },
                    'sass-loader'
                    ]
                })
            },
            {
                test:/\.(css|less)$/,
                use:extractTextWebpackPlugin.extract({
                    fallback:"style-loader",
                    use:[
                        'css-loader',
                        {
                            loader:"postcss-loader",
                            options:{
                                plugins:function(){
                                    require("cssgrace"),
                                    require("autoprefixer"),
                                    require("postcss-px2rem-exclude")(
                                        {
                                            remUnit:100,
                                            exclude:/antd-mobile/i
                                        }
                                    )
                                }
                            }
                        },
                        'less-loader'
                    ]
                })
            }
        ]
    },
    //开发环境 挂起服务器
    devServer:{
        contentBase:path.join(__dirname,'dist'),//声明服务器作用范围
        compress:true,      //压缩
        hot:true,
        inline:true,
        host:'0.0.0.0',     //域名
        open:true,           //自动打开浏览器
        port:7000,
        publicPath:'',       //公共路径
        proxy:{             //代理 处理跨域问题

        }
    },
    //操作 插件
    plugins:[
        //自动注入css/js插件
        new htmlWebpackPlugin({
            template:'./public/index.html', // 操作的模板路径
            inject:true, //自动注入 自动打包成css/js
        }),
        //自动打开浏览器插件
        new openBrowserWebpackPlugin({
            url:"http://localhost:7000"
        }),
        //自动抽离CSS样式插件(防止在JS里面出现css样式会使页面加载报错)
        new extractTextWebpackPlugin({
            filename:"css/app.[hash:8].css", //抽离文件名 由8位随机数组成,避免重复造成浏览器缓存
            allChunks:true, //打包所有文件
            disable:false,  //抽离 确认是否抽离  Disables the plugin//禁止插件
        }),
        //在使用时将不再需要import和require进行引入
        new webpack.ProvidePlugin({
            React:"React",
            Component:['react','Component']
        })
    ]
}
