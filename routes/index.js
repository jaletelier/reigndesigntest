var express = require('express');
var router = express.Router();
var unirest = require('unirest');

/* GET home page. */
router.get('/', function(req, res, next) {
  unirest.get('http://hn.algolia.com/api/v1/search_by_date?query=nodejs').end(
    function (response) {
      console.log(response.body);
      var prettydate = require("pretty-date");
      res.render('index', { title: 'HN Feeds2', news: response.body, prettydate });
  });
 // res.render('index', { title: 'HN Feeds' });
});

module.exports = router;
