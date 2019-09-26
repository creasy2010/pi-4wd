var moonConfig = require('../.moon.json');

module.exports = {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {
    __DEV__: JSON.stringify(true),
    __Config__: JSON.stringify({
      // host: "http://172.19.26.161:8790" //开发
      // host: "https://miniprogrambff.kstore.shop" //线上
      host: 'https://programbff.s2btest.kstore.shop', //测试
      // host: "http://172.19.25.7:8790" //新开发
      // host: "http://172.19.8.92:8790" //bendi
    }),
    __ApiMock__: JSON.stringify(moonConfig.api.mock.mockApi),
  },
  weapp: {},
  h5: {},
};
