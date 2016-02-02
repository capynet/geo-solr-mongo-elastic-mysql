var express = require('express');
var router = express.Router();
var solr = require('solr-client');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

/* GET home page. */
router.post('/points/get', function (req, res, next) {

// Create a client
  var client = solr.createClient({host: "localhost", port: 8080, path: '/solr', core: 'core0'});
  var query = 'q=*:*&wt=json&indent=true&fq={!geofilt%20sfield=geo}&pt=' + req.body.lat + ',' + req.body.lng + '&d=' + req.body.distance + '&rows=2147483647';

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

module.exports = router;
