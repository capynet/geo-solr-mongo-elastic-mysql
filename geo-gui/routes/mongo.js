var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/geo';

router.post('/points/get', function (req, res, next) {

  MongoClient.connect(url, function (err, db) {

    var cursor = db.collection('map_points').find({
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
    });

    var docs = [];

    cursor.each(function (err, doc) {

      if (err) {
        console.log(err);
      }

      if (doc != null) {
        docs.push({coordinates: doc.location.coordinates["1"] + ', ' + doc.location.coordinates["0"]});
      } else {
        console.log('Found: ' + docs.length + ' points from mongodb');

        res.json({
          items: docs,
          found: docs.length
        });
      }
    });

    //db.close();


  });


});

module.exports = router;
