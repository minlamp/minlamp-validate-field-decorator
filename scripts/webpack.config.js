const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const NODE_ENV = process.env.NODE_ENV

const config = {
    entry: {
        app: ['./src/index.js']
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: 'validateFieldDecorator.js',
        libraryTarget: 'umd',
        library: 'validateFieldDecorator',
    },
    mode: NODE_ENV,
    resolve: {
        extensions: ['.js', '.jsx', '.json', 'ts']
    },
    module: {
        rules: [
            {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',

                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
}
console.log('***********************' + NODE_ENV + '***********************')

module.exports = config
