/**
 * Module dependencies.
 */

var express = require('express'),
  engine = require('ejs-locals'),
  routes = require('./routes'),
  productclone = require('./routes/productclone'),
  auth = require('./routes/auth/auth'),
  keyfile = require('./routes/auth/key'),
  pictrans = require('./routes/pictrans/pictrans'),
  http = require('http'),
  path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || keyfile.port);
app.engine('ejs', engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('im ur father'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({
  src: __dirname + '/public'
}));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/clone', productclone.index);
app.get('/clone/read/:id', productclone.read);
app.get('/clone/add', productclone.add);
app.get('/clone/bindpic', productclone.bindpic);
app.get('/auth', auth.auth);
app.get('/pictrans', pictrans.index);
app.get('/pictrans/save', pictrans.save);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});