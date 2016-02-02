$(function () {

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

  /* Km */
  var distance = 50;

  instanceMap('mapa', 'buscador', {zoom: 8, radius: distance});


  var $map = $('#mapa');

  $map.on('gmap.initialized', function (e, map, mapConf) {

    $.post('/points/get', {
      lat: mapConf.initialLatLng[0],
      lng: mapConf.initialLatLng[1],
      distance: distance
    })
      .done(function (data) {
        data.items.forEach(function (item) {
          addMarker(item.geo.split(',')[0], item.geo.split(',')[1], map);
        });

      });

  });

  $map.on('marker.dragend', function (e, lat, lng) {

    $.post('/points/get', {
      lat: lat,
      lng: lng,
      distance: Math.round($map.data('gmap').conf.distance || distance)
    })
      .done(function (data) {
        clearOverlays();
        data.items.forEach(function (item) {
          addMarker(item.geo.split(',')[0], item.geo.split(',')[1], $map.data('gmap').map);
        });

      });

  });

  $map.on('circle.dragend', function (e, distance, lat, lng) {

    $.post('/points/get', {
      lat: $map.data('gmap').conf.marker.getPosition().lat(),
      lng: $map.data('gmap').conf.marker.getPosition().lng(),
      distance: distance
    })
      .done(function (data) {
        clearOverlays();

        data.items.forEach(function (item) {
          addMarker(item.geo.split(',')[0], item.geo.split(',')[1], $map.data('gmap').map);
        });

      });


  });

  $map.on('autocomplete.locationSelected', function (e, lat, lng) {

    $.post('/points/get', {
      lat: lat,
      lng: lng,
      distance: Math.round($map.data('gmap').conf.distance || distance)
    })
      .done(function (data) {
        clearOverlays();

        data.items.forEach(function (item) {
          addMarker(item.geo.split(',')[0], item.geo.split(',')[1], $map.data('gmap').map);
        });

      });

  });

});