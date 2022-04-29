var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login.html', { title: 'RIDE-U | Login' });
});

module.exports = router;
