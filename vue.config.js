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

    plugins.push(
      constantPlugin(
        'ENV',
        JSON.stringify(process.env.NODE_ENV),
      ),
      constantPlugin(
        'SPLATOON_STATS_URL',
        JSON.stringify('https://splatoon-stats.yuki.games'),
      ),
      constantPlugin(
        'SESSION_REFRESH_TIME',
        60 * 60 * 1000, // send GET request to /metadata every 1 hour not to expire session
      ),
    );

    if (process.env.NODE_ENV === 'production') {
      plugins.push(
        constantPlugin(
          'VUE_APP_API_URL',
          JSON.stringify('https://salmon-stats-api.yuki.games'),
        ),
        constantPlugin(
          'IS_BROWSER_UPLOAD_ENABLED',
          JSON.stringify(false),
        ),
      );
    } else {
      plugins.push(
        constantPlugin(
          'VUE_APP_API_URL',
          "'http://' + location.hostname",
        ),
        constantPlugin(
          'IS_BROWSER_UPLOAD_ENABLED',
          JSON.stringify(true),
        ),
      );
    }

    return { plugins };
  },
  devServer: {
    host: '0.0.0.0',
  },
};
