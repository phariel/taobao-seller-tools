var taobao = require('taobao');
var keydata = require('./auth/key').keydata;
exports.taobao = function() {
  taobao.config(keydata);
  return taobao;
}