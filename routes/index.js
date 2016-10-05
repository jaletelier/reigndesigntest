/*jshint esversion: 6 */
var express = require('express');
var router = express.Router();
var unirest = require('unirest');
var url = 'mongodb://heroku_0j0p1pj6:saa1totoe47ks7phk9ip1epg49@ds049466.mlab.com:49466/heroku_0j0p1pj6';
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var prettydate = require("pretty-date");
var itemLimit =8; //How many elements are shown
/* GET home page. */
router.get('/', function(req, res, next) {
  getItems(itemLimit, function(items) {
    res.render('index', {
      title: 'HN Feeds2',
      items: items,
      prettydate
    });
  });
});

/* DELETE hide a element, and return new elements to show */
router.delete('/:id_item', function(req, res, next) {
  deleteItem(req.params.id_item, function() {
    getItems(itemLimit, function(items) {
      res.render('partial_index', {
        title: 'HN Feeds2',
        items: items,
        prettydate
      });
    });
  });
});


module.exports = router;

//Set a element invisible in the database.
var deleteItem = function(id, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('news').updateOne({
      objectID: id
    }, {
      $set: {
        "visible": false
      }
    }, function(err, results) {
      console.log(results);
      callback();
    });
  });
};

//Return a limit number of items to show
var getItems = function(limit, callback) {
  var count = 0;
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var items = [];
    var cursor = db.collection('news').find({
      "visible": true
    }).sort({
      date: -1
    });
    cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc !== null && count < limit) {
        count += 1;
        items.push(doc);
      } else {
        callback(items);
      }
    });
  });
};