var request = require('request');

var urls = require('./urls').urls;
var getApiUrl = urls.getApiUrl;
var localBaseUrl = urls.localBaseUrl;

var getToken = function(req, res) {
  var token = req.session.token;
  return token;
};

exports.index = function(req, res) {
  var token = getToken(req, res);
  if (!token) {
    res.redirect(localBaseUrl);
  }
  res.render('productclone');
};

exports.read = function(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json"
  });

  var id = req.params.id;
  var data = {
    err: ''
  };
  var token = getToken(req, res);
  if (!id) {
    data.err = 'Need id';
    console.log('id error');
    res.end(JSON.stringify(data));
  } else if (!token) {
    data.err = 'Need token';
    console.log('token error');
    res.end(JSON.stringify(data));
  } else {
    var url = getApiUrl(token, {
      'method': 'taobao.item.get',
      'fields': 'title,nick',
      'num_iid': id
    });
    console.log('api url:' + url);
    request(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var bodyObj = JSON.parse(body);
        if (bodyObj.error_response) {
          data.err = bodyObj.error_response.msg;
          res.end(JSON.stringify(data));
        }else{
          res.end(body);
        }
        
      } else {
        data.err = error;
        res.end(JSON.stringify(data));
      }
    })
  }



};

exports.add = function(req, res) {
  res.render('productclone');
};