const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require ('html-webpack-plugin')
const ImageMinWebpackPlugin = require('imagemin-webpack-plugin').default
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const multi = require('multi-loader')
require('babel-polyfill')

const PUBLIC_PATH = path.resolve(__dirname, 'dist')
const devMode = process.env.NODE_ENV !== 'production'
const config = require('./src/templates/config.json')

module.exports = {
  entry: ['babel-polyfill', './src/scripts/index.js'],
  output: {
    filename: 'bundle.js',
    path: PUBLIC_PATH
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            interpolate: true
          }
        }
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
        query: {
          partialDirs: [
            path.join(__dirname, 'partials')
          ],
          helperDirs: [
            path.join(__dirname, 'helper')
          ]
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 
          'css-loader', 
          'postcss-loader', 
          'sass-loader'
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|jpg|gif|jpe?g)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: '[name].[hash:7].[ext]'
          }
        }
      }, 
      {
        test: /\.(png|jpg|jpe?g)$/,
        use: [
          {
            loader: 'responsive-loader',
            options: {
              sizes: [300, 540, 720, 960, 1140]
            }
          },
          {
            loader: multi(
              'file-loader?name=[name].[ext].webp!webp-loader?{quality: 100}',
              'file-loader?name=[name].[ext]'
            )
          }
        ]
      }, 
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }   
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Accueil',
      filename: 'index.html',
      template: 'src/templates/index.hbs',
      customConf: config
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[contenthash].css'
    }),
    new ImageMinWebpackPlugin({ 
      disable: devMode,
      test: /\.(png|jpg|jpe?g|gif|svg|webp)$/,
      pngquant: {
        quality: '75-90'
      },
      mozjpeg: {
        progressive: true,
        quality: 70
      },
      optipng: {
        enabled: true
      },
      gifsicle: {
        interlaced: false
      },
      webp: {
        quality: 75
      }
    })
  ]
}