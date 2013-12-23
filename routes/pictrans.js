var request = require('request');
var fs = require('fs');

var urls = require('./urls').urls;
var getApiUrl = urls.getApiUrl;
var localBaseUrl = urls.localBaseUrl;

var getToken = function(req, res) {
  var token = req.session.token;
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
    var url = getApiUrl(token, {
      'method': 'taobao.picture.upload'
    });
    console.log('url: ' + url);
    var imageName = getImageName(imageUrl);
    console.log('image name: ' + imageName);
    var img = request(imageUrl);
    console.log('img: ' + img);
    request.post({
      uri: url,
      form: {
        'picture_category_id': 0,
        'image_input_title': imageName,
        'img': img
      }
    }, function(error, response, body) {
      console.log('post error: ' + error);
      console.log('body: ' + body);
      if (!error && response.statusCode == 200) {
        var bodyObj = JSON.parse(body);
        if (bodyObj.error_response) {
          data.err = bodyObj.error_response.msg;
          res.end(JSON.stringify(data));
        } else {
          res.end(body);
        }
      } else {
        data.err = error;
        res.end(JSON.stringify(data));
      }
    });
  }
};