
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const express = require('express');
const HTMLPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',//配置mode
    entry: path.join(__dirname, './src/main.js'), // 入口，表示要使用webpack打包哪个文件
    output: {
        filename: '[name].[hash].js',
        chunkFilename: '[name].[chunkhash].js',
        publicPath: '/'
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@components': path.resolve(__dirname, 'src/components'),
            'components': path.resolve(__dirname, 'src/components'),
            '@content': path.resolve(__dirname, 'src/components/content'),
            '@common': path.resolve(__dirname, 'src/components/common'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@services': path.resolve(__dirname, 'src/services'),
            '@/pages': path.resolve(__dirname, 'src/pages'),
        },
    },
    devServer: {
        static: './public',
        setupMiddlewares: (middlewares, devServer) => {
            if (!devServer) {
                throw new Error("webpack-dev-server is not defined");
            }

            middlewares.unshift({
                name: "user-info",
                // `path` 是可选的，接口路径
                path: "/user",
                middleware: (req, res) => {
                    // mock 数据模拟接口数据
                    res.send({ name: "moon mock" });
                },
            });

            return middlewares;
        },

        port: 8000,
        // open:true 自动帮你打开浏览器
        hot: true,

    },
    module: {
        rules: [

            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: file => (
                    /node_modules/.test(file) &&
                    !/\.vue\.js/.test(file)
                )
            },
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {

                            esModule: false,
                            //当加载的图片小于limit时，会将图片编译成base64字符串的形式,
                            //当图片大于这个limit，会用file-loader进行加载
                            limit: 100,
                            //在webpack4.x必须显式的指定fallback备用方法，这里指定为file-loader
                            fallback: require.resolve('file-loader'),
                            encoding: "base64",
                            //这个表示在打包生成的文件的名字，如果不配置这个，会根据hash生成一个名字，这个配置就是自定义命名规则
                            //这个表示会在输出文件夹dist下创建一个img文件夹，所有的文件会以 “原名字+hash值8位+文件扩展名”生成最终的文件来供使用
                            name: "img/[name].[hash:8].[ext]",
                        },
                    },
                    /*上面指定了fallback，是必须的，在webpack4.x下，不要配置下面这个file-loader，因为这里我遇到了坑，先是配置了上面的
                    url-loader,然后配置了下面的file-loader，最后图片文件是按照配置生成了，但是却不引用，没生效，页面没有加载，同时配置了下面这个
                    还影响了页面中base64显示图片，不会加载出来，但是当我把下面这个配置删除时，执行npm run dev打包时却显示找不到file-loader，搞了
                    很久，才试出来，需要在url-loader中配置fallback来显示指定备用方法指向file-loader，这样才有效果，同时，上面指定fallback，也不要
                    配置下面这个file-loader，否则依然不起效果
                     */
                    // {
                    //     loader: 'file-loader',
                    //     options: {
                    //         //这个表示在打包生成的文件的名字，如果不配置这个，会根据hash生成一个名字，这个配置就是自定义命名规则
                    //         //这个表示会在输出文件夹dist下创建一个img文件夹，所有的文件会以 “原名字+hash值8位+文件扩展名”生成最终的文件来供使用
                    //         name: "img/[name].[hash:8].[ext]",
                    //         publicPath: './dist/',
                    //     },
                    // },
                ]
            },
        ]
    },
    plugins:

        [
            new VueLoaderPlugin(),
            new HTMLPlugin({
                filename: 'index.html',
                template: './public/index.html',
                url: "/assets",  //需要这里传参
            }),
        ]


}