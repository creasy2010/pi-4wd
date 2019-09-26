var path = require('path');
const config = {
  projectName: 'taroDemo',
  date: '2019-5-22',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  alias: {
    '@/assets': path.resolve(__dirname, '..', 'src/assets'),
    '@/common': path.resolve(__dirname, '..', 'src/common'),
    '@/pages': path.resolve(__dirname, '..', 'src/pages'),
    '@/service': path.resolve(__dirname, '..', 'src/service'),
    '@/redux': path.resolve(__dirname, '..', 'src/redux'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    '@/libs': path.resolve(__dirname, '..', 'src/libs'),
    api: path.resolve(__dirname, '..', 'src/webapi'),
    '@/*': path.resolve(__dirname, '..', 'src/*'),
  },
  plugins: {
    babel: {
      sourceMap: true,
      presets: [
        [
          'env',
          {
            modules: false,
          },
        ],
      ],
      plugins: ['transform-decorators-legacy', 'transform-class-properties', 'transform-object-rest-spread'],
    },
    // uglify: {
    //   enable: true,
    //   config: {
    //     warnings: false,
    //     compress: {
    //       drop_debugger: true,
    //       drop_console: true,
    //     },
    //   }
    // },
    // csso: {
    //   enable: true
    // },
    sass: {
      resource: path.resolve(__dirname, '..', 'src/common/style/swipe.scss'),
      // OR
      // resource:  ['path/to/global.variable.scss', 'path/to/global.mixin.scss']
      projectDirectory: path.resolve(__dirname, '..'),
      data: '$nav-height: 48px;',
    },
  },
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  weapp: {
    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: ['last 3 versions', 'Android >= 4.1', 'ios >= 8'],
          },
        },
        pxtransform: {
          enable: true,
          config: {},
        },
        url: {
          enable: true,
          config: {
            limit: 10240, // 设定转换尺寸上限
          },
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    esnextModules: ['taro-ui'],
    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: ['last 3 versions', 'Android >= 4.1', 'ios >= 8'],
          },
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
    },
  },
};

module.exports = function(merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};
