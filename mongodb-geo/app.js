// Load dependency
var Chance = require('chance');
var chance = new Chance();
var MongoClient = require('mongodb').MongoClient;


// Creamos un huevo de documentos
var docs = [];
var loopQty = 1000;

console.time("Generate mongo points");
for (var i = 0; i <= loopQty; i++) {

  var coords = chance.coordinates().split(', ');

  var doc = {
    "location":{
      "type" : "Point",
      "coordinates" : [parseFloat(coords[1]), parseFloat(coords[0])]
    },
    "name": "foo" + i

  };

  docs.push(doc);
}
console.timeEnd("Generate mongo points");


console.time("Mongo add documents");

MongoClient.connect('mongodb://localhost:27017/geo', function(err, db) {
  // Get the collection
  var col = db.collection('map_points');
  col.insertMany(docs, function(err, r) {
    if (err) {
      console.log(err);
    }else{
      console.log(r.insertedCount + ' added.');
    }

    console.timeEnd("Mongo add documents");
    db.close();
  });
});
