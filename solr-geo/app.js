// Load dependency
var solr = require('solr-client');
var uuid = require('node-uuid');
var Chance = require('chance');
var chance = new Chance();

// Create a client
var client = solr.createClient({
  host: "localhost",
  port: 8983,
  path: '/solr',
  core: 'geo'
});

// Creamos un huevo de documentos
var docs = [];
var loopQty = 1000000;

console.time("Generate points");
for (var i = 0; i <= loopQty; i++) {
  var doc = {
    id: uuid.v4(),
    coordinates: chance.coordinates()
  };
  docs.push(doc);
}
console.timeEnd("Generate points");

console.time("Solr add documents");

// Add documents
client.add(docs, {commit: true}, function (err, obj) {
  if (err)  console.log(err);
  console.timeEnd("Solr add documents");
});
