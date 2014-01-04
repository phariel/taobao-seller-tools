## Taobao seller tools

### Init

`$ git clone`

`$ npm install`

### Preparation

Create `key.js` under `routes/auth/` folder.

Template:

```
exports.keydata = {
	app_key = 'your appkey',
	app_secret = 'your appsecret'
}

exports.port = your local port

exports.localBaseUrl = 'your callback url' + port
```
then
`$  node app`

Enjoy.

---

Features:
功能

Product Cloning: Auto fetch target taobao/tmall product data and clone to own storage. Auto parse product's, description's and properties' images and re-upload to own taobao picture space.

一键复制：自动获取淘宝/天猫上目标产品的数据，并克隆到自己的卖家仓库中。同时，将产品以及描述和属性相关的全部图片，重新上传到自己的淘宝图片空间里，真正达到完美复制。

Image Transferring: parse target image url and re-upload to own taobao picture space.

图片搬家：将网络上的任意图片搬家到自己的淘宝图片空间里以备后用。