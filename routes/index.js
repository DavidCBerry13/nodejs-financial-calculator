var express = require('express');
var router = express.Router();
const limit = require("express-limit").limit;

/* GET home page. */
router.get(
  '/', 
  limit({
    max: 5, // 5 requests
    period: 60 * 1000, // per minute (60 seconds)
  }),
  function(req, res, next) {
  res.render('index', { title: 'Home - Financial Calculator' });
});

module.exports = router;
