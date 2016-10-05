// db-schedule.js
var unirest = require('unirest');
var url = 'mongodb://heroku_0j0p1pj6:saa1totoe47ks7phk9ip1epg49@ds049466.mlab.com:49466/heroku_0j0p1pj6';
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var exports = module.exports = {};

exports.startDBSchedule = function(hours) {
  checkForNewItems();
  the_interval = hours* 60 * 60 * 1000; //1 hour
  setInterval(checkForNewItems, the_interval);
  console.log("DB Schedule set");
};

var checkForNewItems = function() {
  console.log("Checking for new items");
  unirest.get('http://hn.algolia.com/api/v1/search_by_date?query=nodejs').end(
    function(response) {
      response.body.hits.forEach(function(item) {
        addIfNotExist(item);
      });

    });
}


var addIfNotExist = function(item) {
  MongoClient.connect(url, function(err, db) {
    if(err){
      console.log("Error while connecting to database");
      console.log(err);
      db.close();
      return
    }
    var cursor = db.collection('news').find({
      "objectID": item.objectID
    });
    cursor.toArray(function(err, document) {
      if (document.length === 0 && (item.title !== null || item.story_title !== null) && (item.story_url !== null || item.url !== null)) {
        insertItem(db, {
          title: item.story_title !== null ? item.story_title : item.title,
          author: item.author,
          date: item.created_at,
          objectID: item.objectID,
          url: item.story_url !== null ? item.story_url : item.url,
          visible: true
        }, function() {
          db.close();
        });
      } else {
        db.close();
      }
    });
  });
};

var insertItem = function(db, item, callback) {
  db.collection('news').insertOne(item, function(err, result) {
    if(err){
      console.log("Error on insert one item:");
      console.log(item);
      return
    }
    console.log("New item added");
    callback();
  });
};