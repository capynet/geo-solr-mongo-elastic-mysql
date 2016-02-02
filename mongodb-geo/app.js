// Load dependency
var client = require('mongoose');
var uuid = require('node-uuid');
var Chance = require('chance');
var chance = new Chance();

mongoose.connect('mongodb://localhost/geo');

var coords = mongoose.model('Coords', { name: String });

// Creamos un huevo de documentos
var docs = [];
var loopQty = 1000000;

console.time("Generar");
for (var i = 0; i <= loopQty; i++) {
  var doc = {
    id: uuid.v4(),
    geo: chance.coordinates()
  };
  docs.push(doc);
}
console.timeEnd("Generar");

console.time("Solr");

// Add documents
client.add(docs, {commit: true}, function (err, obj) {
  if (err) {
    console.log(err);
  } else {
    //console.log(obj);
  }

  console.timeEnd("Solr");
});
