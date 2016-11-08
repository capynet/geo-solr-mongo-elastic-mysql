var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/geo';

router.post('/points/get', function (req, res, next) {


  var findDocuments = function (db, req, callback) {
    // Get the documents collection
    var collection = db.collection('map_points');

    // Find some documents
    var criteria = {
      location: {
        $geoWithin: {
          $centerSphere: [
            [
              parseFloat(req.body.lng),
              parseFloat(req.body.lat)
            ],
            req.body.distance / 6378.1 // we convert the distance to radiants. earth radius 6378.1
          ]
        }
      }
    };

    var justTheseFields = {"location.coordinates": 1, _id: 0};

    var exportedStats = {};

    // Collect some stats
    collection.find(criteria, justTheseFields).explain(function (err, explain) {
      exportedStats = {
        found: explain.executionStats.nReturned,
        time: explain.executionStats.executionTimeMillis
      }
    });

    collection.find(criteria, justTheseFields).toArray(function (err, docs) {
      callback(docs, exportedStats);
    });
  };

  MongoClient.connect(url, function (err, db) {
    findDocuments(db, req, function (docs, stats) {
      db.close();

      console.log('Found: ' + docs.length + ' points from mongodb');

      res.json({
        items: docs,
        stats: stats
      });

    });
  });


});

module.exports = router;
