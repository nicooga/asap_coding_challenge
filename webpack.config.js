const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, 'src/index.jsx'),
  devtool: 'source-maps',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Nicolas Oga',
      template: 'src/index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /^node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: {
          loader: 'svg-react-loader',
          options: {
            props: {
              width: 24,
              height: 24
            }
          }
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|jfif|webp)$/,
        use: [
          {
            loader: 'file-loader',
            options: { outputPath: 'images/' }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    historyApiFallback: true
  }
}
