exports.index = function(req, res) {
  var data = {
    'authorized': false
  };

  if (req.cookies.token) {
    data.authorized = true;
  }
  res.render('index', data);
};