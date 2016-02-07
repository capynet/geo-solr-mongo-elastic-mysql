// Load dependencies
var Chance = require('chance');
var chance = new Chance();
var MongoClient = require('mongodb').MongoClient;


// We create a lot of ramdom points on the earth
var docs = [];
var loopQty = 1000000;

console.time("Generate mongo points");
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
console.timeEnd("Generate mongo points");


console.time("Mongo add documents");

MongoClient.connect('mongodb://localhost:27017/geo', function (err, db) {
  // Get the collection
  var col = db.collection('map_points');

  // before add all the documents we empty the entire collection.
  col.remove({});
  console.log('collection now is empty');

  col.insertMany(docs, function (err, r) {
    if (err) {
      console.log(err);
    } else {
      console.log(r.insertedCount + ' document were added.');

      console.time("Create index");
      // finally we create a 2dsphere index to allow us geospatial searches.
      col.createIndex({"location": "2dsphere"});
      console.log('2dsphere index created');
      console.timeEnd("Create index");
    }

    console.timeEnd("Mongo add documents");
    db.close();
  });
});
