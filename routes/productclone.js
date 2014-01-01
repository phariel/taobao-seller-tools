var request = require('request');
var taobao = require('./taobao-config').taobao();
var jsdom = require('jsdom');
var async = require('async');
var upload = require('./pictrans/upload').upload;

var urls = require('./urls').urls;
var getApiUrl = urls.getApiUrl;
var postApiUrl = urls.postApiUrl;
var localBaseUrl = urls.localBaseUrl;

var getToken = function(req, res) {
  var token = req.cookies.token;
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
  } else {
    taobao.core.call({
      'method': 'taobao.item.get',
      'fields': 'nick,num,price,type,stuff_status,title,desc,location,cid,props,property_alias,input_pids,input_str,item_img,prop_img',
      'num_iid': id
    }, function(body) {
      var bodyObj = JSON.parse(body);
      if (bodyObj.error_response) {
        data.err = bodyObj.error_response.msg;
        res.end(JSON.stringify(data));
      } else {
        req.session.clonefrom = body;
        res.end(body);
      }
    });
  }
};

exports.add = function(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json"
  });
  var data = {
    err: ''
  };
  var token = getToken(req, res);
  var item = req.session.clonefrom;
  if (!token) {
    data.err = 'Need token';
    console.log('token error');
    res.end(JSON.stringify(data));
  } else if (!item) {
    data.err = 'Need clonefrom data';
    console.log('clonefrom data error');
    res.end(JSON.stringify(data));
  } else {
    item = JSON.parse(item);
    item = item.item_get_response.item;
    if (item.item_imgs) {
      req.session.item_img = item.item_imgs.item_img;
    } else {
      req.session.item_img = false;
    }
    if (item.prop_imgs) {
      req.session.prop_img = item.prop_imgs.prop_img;
    } else {
      req.session.prop_img = false;
    }

    jsdom.env({
      html: item.desc,
      scripts: [
        localBaseUrl + '/_scripts/jquery.min.js'
      ],
      done: function(err, window) {
        var $ = window.$;
        var picArr = [];
        $('img').each(function() {
          var $this = $(this);
          picArr.push($this.attr('src'));
        });
        console.log('picArr: ' + picArr);

        var picIndex = 0;
        async.whilst(function() {
          return picIndex < picArr.length;
        }, function(next) {
          var oldPath = picArr[picIndex];
          upload(oldPath, token, function(pic) {
            var newPath = '';
            if (pic.err) {
              newPath = pic.err;
            } else {
              newPath = pic.picture_path;
            }
            item.desc = item.desc.replace(oldPath, newPath);

            picIndex++;
            next();
          });
        }, function(err) {
          if (err) {
            data.err = 'savelist error: ' + err;
            console.log(data.err);
            res.end(JSON.stringify(data));
            return;
          }
          request.post({
            headers: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            uri: postApiUrl.url,
            form: {
              access_token: token,
              v: postApiUrl.v,
              format: postApiUrl.format,
              method: 'taobao.item.add',
              num: item.num,
              price: item.price,
              type: item.type,
              stuff_status: item.stuff_status,
              title: item.title,
              desc: item.desc,
              'location.state': item.location.state,
              'location.city': item.location.city,
              approve_status: 'instock',
              cid: item.cid,
              props: item.props,
              property_alias: item.property_alias,
              input_pids: item.input_pids,
              input_str: item.input_str
            }
          }, function(error, response, body) {
            if (error) {
              data.err = 'post error: ' + error;
              console.log(data.err);
              res.end(JSON.stringify(data));
            }
            if (!error && response.statusCode == 200) {
              //body = JSON.parse(body);
              var bodyObj = JSON.parse(body);
              req.session.newiid = bodyObj.item_add_response.item.num_iid;
              console.log(body);
              res.end(body);
            }
          });
        });
      }
    });
  }
};

exports.bindpic = function(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json"
  });
  var data = {
    err: ''
  };
  var token = getToken(req, res);
  var newiid = req.session.newiid;
  if (!token) {
    data.err = 'Need token';
    console.log('token error');
    res.end(JSON.stringify(data));
  } else if (!newiid) {
    data.err = 'Need newiid';
    console.log('newiid error');
    res.end(JSON.stringify(data));
  } else {
    var item_img = req.session.item_img;
    if (item_img) {
      var picIndex = 0;
      async.whilst(function() {
        return picIndex < item_img.length;
      }, function(next) {
        var img = item_img[picIndex];
        upload(img.url, token, function(newImg) {
          if (!newImg.err) {
            taobao.core.call({
              'session': token,
              'method': 'taobao.item.joint.img',
              'num_iid': newiid,
              'pic_path': newImg.picture_path.split('imgextra/')[1],
              'position': img.position,
              'is_major': (img.id == 0) ? true : false
            }, function(body) {
              console.log(newImg.picture_path + ' bind: ' + JSON.stringify(body));

              picIndex++;
              next();
            });
          }
        });
      }, function(err) {
        if (err) {
          data.err = err;
          console.log('bindlist error: ' + err);
        } else {
          data = {
            item_img: true
          };
        }

        res.end(JSON.stringify(data));
      });
    }
  }
};