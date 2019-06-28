const webpack = require('webpack');

module.exports = {
  lintOnSave: false,
  configureWebpack() {
    let plugins = [];

    const constantPlugin = (key, value) => {
      const obj = {};
      obj[key] = value;
      return new webpack.DefinePlugin(obj);
    };

    plugins.push(constantPlugin(
      'SPLATOON_STATS_URL',
      JSON.stringify('https://splatoon-stats.yuki.games'),
    ));

    if (process.env.NODE_ENV === 'production') {
      plugins.push(constantPlugin(
        'VUE_APP_API_URL',
        JSON.stringify('https://salmon-stats-api.yuki.games'),
      ));
    } else {
      plugins.push(constantPlugin(
        'VUE_APP_API_URL',
        // eslint-disable-next-line no-template-curly-in-string
        "'http://' + location.hostname",
      ));
    }

    return { plugins };
  },
};
