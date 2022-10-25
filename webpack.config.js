const path = require('path');
module.exports = {
    entry: {
        Game: './src/script/Game.ts'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'Game.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    watch: true
}