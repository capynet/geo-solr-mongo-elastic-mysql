var express = require('express');
var router = express.Router();
var solr = require('solr-client');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/geo';

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

/* Get solr points. */
/*
 router.post('/points/get', function (req, res, next) {

 // Create a client
 var client = solr.createClient({host: "localhost", port: 8983, path: '/solr', core: 'geo'});
 var query = 'q=*:*&wt=json&indent=true&fq={!geofilt%20sfield=coordinates}&pt=' + req.body.lat + ',' + req.body.lng + '&d=' + req.body.distance + '&rows=2147483647';

 client.get('select', query, function (err, obj) {
 if (err) {
 console.log(err);
 } else {
 res.json({
 items: obj.response.docs,
 found: obj.response.numFound
 });
 }
 });

 });
 */

/* Get mongodb points. */
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
