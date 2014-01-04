var keyfile = require('./auth/key');

exports.urls = {
  authUrl: 'https://oauth.taobao.com/authorize',
  tokenUrl: 'https://oauth.taobao.com/token',
  localBaseUrl: keyfile.localBaseUrl,
  apiUrl: 'https://eco.taobao.com/router/rest',
  getApiUrl: function(token, options) {
    var apiUrl = 'https://eco.taobao.com/router/rest';
    apiUrl += '?access_token=' + token + '&v=2.0&format=json';
    if (options) {
      for (option in options) {
        apiUrl += '&' + option + '=' + options[option];
      }
    }
    return apiUrl;
  },
  postApiUrl: {
    url: 'https://eco.taobao.com/router/rest',
    v: '2.0',
    format: 'json'
  }
};