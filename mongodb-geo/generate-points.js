console.log("Creating mongodb points");

// Load dependencies
var Chance = require('chance');
var chance = new Chance();
var MongoClient = require('mongodb').MongoClient;


// We create a lot of ramdom points on the earth
var docs = [];
var loopQty = 10000;

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

console.log("Adding documents to mongodb...");

MongoClient.connect('mongodb://localhost:27017/geo', function (err, db) {

  console.log("Empty the collection 'map_points'");
  // Empty the collection.
  db.dropCollection("map_points");

  // Get the collection
  var col = db.collection('map_points');

  // Finally we create a 2dsphere index to allow us geospatial searches.
  col.createIndex({"location": "2dsphere"});
  console.log('Created 2dsphere index');

  console.time("Mongo add documents took time");
  col.insertMany(docs, function (err, r) {
    if (err) {
      console.log(err);
    } else {
      console.log(r.insertedCount + ' document were added to mongodb.');
    }

    console.timeEnd("Mongo add documents took time");

    db.close();
  });
});
