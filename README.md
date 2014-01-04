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