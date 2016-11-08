// Load dependencies
var Chance = require('chance');
var chance = new Chance();
var MongoClient = require('mongodb').MongoClient;


function generatePointOnRam(loopQty, cb) {
  // We create a lot of ramdom points on the earth
  var docs = [];

  console.time("Generate points on RAM");
  for (var i = 1; i <= loopQty; i++) {

    var coords = chance.coordinates().split(', ');

    var doc = {
      "location": {
        "type": "Point",
        "coordinates": [parseFloat(coords[1]), parseFloat(coords[0])]
      }
    };

    docs.push(doc);
  }
  console.timeEnd("Generate points on RAM");
  cb(docs);
}

function addDocuments(docs, cb) {
  console.log("Adding documents to mongodb...");

  MongoClient.connect('mongodb://localhost:27017/geo', function (err, db) {

    // Get the collection
    var col = db.collection('map_points');

    // console.time("Mongo add documents took time");

    col.insertMany(docs, function (err, r) {
      if (err) {
        console.log(err);
      } else {
        console.log(r.insertedCount + ' document were added to mongodb.');
      }

      // console.timeEnd("Mongo add documents took time");

      db.close();
      cb();
    });
  });

}

function emptyCollection() {
  MongoClient.connect('mongodb://localhost:27017/geo', function (err, db) {
    console.log("Empty the collection 'map_points'");
    db.dropCollection("map_points");
    db.close();
  });
}

function createIndex() {
  MongoClient.connect('mongodb://localhost:27017/geo', function (err, db) {
    // Get the collection
    var col = db.collection('map_points');

    // Finally we create a 2dsphere index to allow us geospatial searches.
    col.createIndex({"location": "2dsphere"}, {}, function (err, indexName) {
      console.log('Created 2dsphere index');
      db.close();
    });
  });
}

function generateBulkDocs(cnt, bulkQty) {

  generatePointOnRam(bulkQty, function (docs) {
    addDocuments(docs, function () {
      cnt--;
      if (cnt > 0) {
        generateBulkDocs(cnt, bulkQty);
      }
    });
  });

}


// emptyCollection();
generateBulkDocs(1000, 100000);
