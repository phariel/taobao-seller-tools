exports.urls = {
  'authUrl': 'https://oauth.taobao.com/authorize',
  'tokenUrl': 'https://oauth.taobao.com/token',
  'localBaseUrl': 'http://tbproductclone.com:8431',
  'getApiUrl': function(token, options) {
    var apiUrl = 'https://eco.taobao.com/router/rest';
    apiUrl += '?access_token=' + token + '&v=2.0';
    if (options) {
      for (option in options) {
        apiUrl += '&' + option + '=' + options[option];
      }
    }
    return apiUrl;
  }
};