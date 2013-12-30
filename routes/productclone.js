var request = require('request');
var taobao = require('./taobao-config').taobao();

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
      'fields': 'nick,num,price,type,stuff_status,title,desc,location,cid,props,property_alias,input_pids,input_str',
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
        console.log(body);
        res.end(body);
      }
    });

  }
};