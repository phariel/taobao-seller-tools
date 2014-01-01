var urls = require('../urls').urls;
var localBaseUrl = urls.localBaseUrl;
var upload = require('./upload').upload;

var getToken = function(req, res) {
  var token = req.cookies.token;
  return token;
};

var getImageName = function(name) {
  var arr = name.split('/');
  return arr[arr.length - 1];
};

exports.index = function(req, res) {
  var token = getToken(req, res);
  if (!token) {
    res.redirect(localBaseUrl);
  }
  res.render('pictrans');
};

exports.save = function(req, res) {
  var data = {
    err: ''
  };
  var imageUrl = req.query.url;
  console.log('image url: ' + imageUrl);
  var token = getToken(req, res);
  if (!imageUrl) {
    data.err = 'Need url';
    console.log('url error');
    res.end(JSON.stringify(data));
  } else if (!token) {
    data.err = 'Need token';
    console.log('token error');
    res.end(JSON.stringify(data));
  } else {
    upload(imageUrl, token, function(body) {
      res.end(JSON.stringify(body));
    })
  }
};