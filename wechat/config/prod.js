module.exports = {
  env: {
    NODE_ENV: '"production"',
  },
  defineConstants: {
    __DEV__: JSON.stringify(false),
    __Config__: JSON.stringify({
      // host: 'https://miniprogrambff.chongzhanggui.kstore.shop',
      host: 'https://programbff.s2btest.kstore.shop', //测试
    }),
    __ApiMock__: JSON.stringify({}),
  },
  weapp: {},
  h5: {
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
     * 参考代码如下：
     * webpackChain (chain) {
     *   chain.plugin('analyzer')
     *     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
     * }
     */
  },
};
