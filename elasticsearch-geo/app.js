// Load dependencies
var Chance = require('chance');
var chance = new Chance();

var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: 'localhost:9200'
});

// https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-2-2.html
//client.bulk([params, [callback]])

/*
 client.index({
 index: 'blog',
 type: 'puntos',
 body: {
 "location" : "41.12,-71.34"
 }
 }, function (error, response) {
 console.log(response);
 });
 */

/*
 client.bulk({
 body: [
 // action description
 { index:  { _index: 'blog', _type: 'bar' } },
 // the document to index
 { title: 'foo' },
 // --------------    // action description
 { index:  { _index: 'blog', _type: 'bar' } },
 // the document to index
 { title: 'foo' },
 // --------------    // action description
 { index:  { _index: 'blog', _type: 'bar' } },
 // the document to index
 { title: 'foo' },
 // --------------    // action description
 { index:  { _index: 'blog', _type: 'bar' } },
 // the document to index
 { title: 'foo' },
 // --------------1
 ]
 }, function (err, resp) {

 });
 */


client.search({
  index: 'blog',
  type: 'puntos'
}, function (error, response) {
  console.log(response.hits.hits[0]._source);
});


/*
 client.indices.putMapping([{
 index: 'blog',
 type: 'puntos',
 mappings: {
 "properties": {
 "location": {
 "type": "geo_point"
 }
 }
 }
 }, function (error, response) {
 console.log(response);
 }]);
 */