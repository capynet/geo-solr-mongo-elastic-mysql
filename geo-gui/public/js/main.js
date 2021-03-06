$(function () {
  var logger = new Logger('#info');
  var engine = 'mongo';
  var markersArray = [];

  function addMarker(lat, lng, map) {
    var marker = new google.maps.Marker({map: map, draggable: false, anchorPoint: new google.maps.Point(0, 0)});
    marker.setPosition(new google.maps.LatLng(lat, lng));
    marker.setVisible(true);
    markersArray.push(marker);
  }

  // Removes the overlays from the map, but keeps them in the array
  function clearOverlays() {
    markersArray.forEach(function (marker) {
      marker.setMap(null);
    });
  }

  /**
   * Search on the backend.
   * @param params
   */
  function backendSearch(params) {

    $.post('/' + engine + '/points/get', params)
      .done(function (data) {

        logger.addItem('Engine: ' + engine);
        logger.addItem('Items found: ' + data.stats.found);
        logger.addItem('Query time (ms): ' + data.stats.time);
        clearOverlays();

        data.items.forEach(function (item) {
          addMarker(item.location.coordinates[1], item.location.coordinates[0], $map.data('gmap').map);
        });

        logger.render();
      });
  }

  /* Km */
  logger.addItem('Distance (km): 50');
  var distance = 50;
  instanceMap('mapa', 'buscador', {zoom: 8, radius: distance});
  var $map = $('#mapa');

  // Events
  // -----------------------------------------------------
  $map.on('gmap.initialized', function (e, map, mapConf) {
    var params = {lat: mapConf.initialLatLng[0], lng: mapConf.initialLatLng[1], distance: distance};
    backendSearch(params);
  });

  $map.on('marker.dragend', function (e, lat, lng) {
    var params = {lat: lat, lng: lng, distance: Math.round($map.data('gmap').conf.distance || distance)};
    backendSearch(params);
  });

  $map.on('circle.resized', function (e, distance, lat, lng) {
    logger.addItem('Distance (km): ' + distance);
    var params = {lat: $map.data('gmap').conf.marker.getPosition().lat(), lng: $map.data('gmap').conf.marker.getPosition().lng(), distance: distance};
    backendSearch(params);
  });

  $map.on('autocomplete.locationSelected', function (e, lat, lng) {
    var params = {lat: lat, lng: lng, distance: Math.round($map.data('gmap').conf.distance || distance)};
    backendSearch(params);
  });

  // We update the engine when the user changes it.
  $("#engine-selection").find("input[name='engine']").change(function (e) {
    engine = $(this).val();
    console.log("Selected " + engine + " engine");

    var params = {lat: $map.data('gmap').conf.marker.getPosition().lat(), lng: $map.data('gmap').conf.marker.getPosition().lng(), distance: distance};
    backendSearch(params);
  });

});