var request = require('request');
var FormData = require('form-data');
var fs = require('fs');

var urls = require('./urls').urls;
var getApiUrl = urls.getApiUrl;
var postApiUrl = urls.postApiUrl;
var localBaseUrl = urls.localBaseUrl;

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
    var imageName = getImageName(imageUrl);
    console.log('image name: ' + imageName);

    var form = new FormData();
    form.append('method', 'taobao.picture.upload');
    form.append('access_token', token);
    form.append('v', postApiUrl.v);
    form.append('format', postApiUrl.format);
    form.append('picture_category_id', 0);
    form.append('image_input_title', imageName);
    form.append('img', request(imageUrl));

    form.submit(postApiUrl.url, function(err, postRes) {
      console.log('post error: ' + err);
      if (!err) {
        var body = '';
        postRes.on('data', function(chunk) {
          body += chunk;
        });
        postRes.on('end', function() {
          console.log('post body: ' + body);
          var bodyObj = JSON.parse(body);
          if (bodyObj.error_response) {
            data.err = bodyObj.error_response.msg;
            res.end(JSON.stringify(data));
          } else {
            res.end(body);
          }
        });
      } else {
        data.err = err;
        res.end(JSON.stringify(data));
      }
    });
  }
};