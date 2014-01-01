var request = require('request');
var FormData = require('form-data');
var urls = require('../urls').urls;
var postApiUrl = urls.postApiUrl;

var getImageName = function(name) {
  var arr = name.split('/');
  return arr[arr.length - 1];
};

exports.upload = function(imageUrl, token, cb) {
  var data = {
    err: ''
  };

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
          cb(data);
        } else {
          cb(bodyObj.picture_upload_response.picture);
        }
      });
    } else {
      data.err = err;
      cb(data);
    }
  });
};