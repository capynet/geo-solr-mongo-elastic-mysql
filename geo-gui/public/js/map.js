/**
 * Generates a map.
 *
 * @param {String} placeholder the ID where the map will be placed.
 * @param {String} inputField the name attribute of the input. This will have the autocomplete attached.
 * @param {Object} config Map params.
 * @param {Function} cb callback.
 *
 * @return {Object} gmap object
 * */
function instanceMap(placeholder, inputField, config) {

  config || (config = {});
  var $placeholder = $('#' + placeholder);

  var c = $.extend({
    markerDraggable: true,
    initialLatLng: [51.5073457, -0.1276816],
    zoom: 16
  }, config);

  function DistanceWidget(map) {
    this.set('map', map);
    this.set('position', map.getCenter());
    var marker = new google.maps.Marker({
      draggable: c.markerDraggable
    });

    marker.setIcon(({
      url: '/images/pin-orange.png'
    }));

    marker.bindTo('map', this);
    marker.bindTo('position', this);

    // Expose the marker
    c.marker = marker;

    // Drag marker event.
    google.maps.event.addListener(marker, "dragend", function (event) {
      // Launch an event to allow other components react:
      $placeholder.trigger("marker.dragend", [event.latLng.lat(), event.latLng.lng()]);
    });

    var radiusWidget = new RadiusWidget();
    radiusWidget.bindTo('map', this);
    radiusWidget.bindTo('center', this, 'position');
    this.bindTo('distance', radiusWidget);
    this.bindTo('bounds', radiusWidget);
  }

  DistanceWidget.prototype = new google.maps.MVCObject();

  /**
   * Genera y enlaza un circulo
   * @constructor
   */
  function RadiusWidget() {
    var circle = new google.maps.Circle({
      radius: c.radius, //metros
      fillColor: '#369',
      strokeColor: '#369'
    });
    this.set('distance', c.radius);
    this.bindTo('bounds', circle);
    circle.bindTo('center', this);
    circle.bindTo('map', this);
    circle.bindTo('radius', this);

    this.addSizer_();
  }

  RadiusWidget.prototype = new google.maps.MVCObject();

  /**
   * Este es un callback para el evento homónimo.
   * Aqui es donde cambiamos el tamaño del circulo cuando algo (todavia no se que) cambia la distancia.
   */
  RadiusWidget.prototype.distance_changed = function () {
    this.set('radius', this.get('distance') * 1000);
  };

  RadiusWidget.prototype.addSizer_ = function () {
    var sizer = new google.maps.Marker({
      draggable: true
    });

    sizer.setIcon(({
      url: '/images/icon-resize.png',
      anchor: new google.maps.Point(16, 16)
    }));

    sizer.bindTo('map', this);
    sizer.bindTo('position', this, 'sizer_position');
    var me = this;

    // Expose the marker
    c.distance = me.getDistance();

    // Drag marker event.
    google.maps.event.addListener(sizer, "dragend", function (event) {
      // Launch an event to allow other components react:
      c.distance = me.getDistance();
      $placeholder.trigger("circle.dragend", [me.getDistance(), event.latLng.lat(), event.latLng.lng()]);
    });


    google.maps.event.addListener(sizer, 'drag', function () {
      me.setDistance();
    });
  };
  RadiusWidget.prototype.center_changed = function () {
    var bounds = this.get('bounds');
    if (bounds) {
      var lng = bounds.getNorthEast().lng();
      var position = new google.maps.LatLng(this.get('center').lat(), lng);
      this.set('sizer_position', position);
    }
  };

  RadiusWidget.prototype.distanceBetweenPoints_ = function (p1, p2) {
    if (!p1 || !p2) {
      return 0;
    }
    var R = 6371;
    var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
    var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  RadiusWidget.prototype.getDistance = function () {
    var pos = this.get('sizer_position');
    var center = this.get('center');
    var distance = this.distanceBetweenPoints_(center, pos);
    var distance = Math.round(distance * 100) / 100;
    return distance;
  };

  RadiusWidget.prototype.setDistance = function () {
    var distance = this.getDistance();
    this.set('distance', distance);
  };


  function init() {

    var mapOptions = {
      center: new google.maps.LatLng(c.initialLatLng[0], c.initialLatLng[1]),
      zoom: c.zoom
    };

    // Initiate the map.
    var map = new google.maps.Map(document.getElementById(placeholder), mapOptions);


    // Strict comparison to avoid "falsy" results
    // Link an input text to the map as autocomplete.
    if (inputField !== null) {
      var input = document.getElementById(inputField);
      var autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo('bounds', map);
    }

    var distanceWidget = new DistanceWidget(map);

    // Adjust map position when the window get resized.
    google.maps.event.addDomListener(window, 'resize', function () {
      map.setCenter(mapOptions.center);
    });


    // Autocomplete event listener.
    inputField !== null && google.maps.event.addListener(autocomplete, 'place_changed', function () {
      var place = autocomplete.getPlace();
      c.marker.setVisible(false);

      if (!place.geometry) {
        // no results found
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
      }

      map.setZoom(c.zoom);
      console.log(c.zoom);

      // Move the marker.
      c.marker.setPosition(place.geometry.location);
      c.marker.setVisible(true);
      // Launch an event to allow other components react:
      $placeholder.trigger("autocomplete.locationSelected", [place.geometry.location.lat(), place.geometry.location.lng()]);
    });


    // Finally launch the callback with the map and it config to allow others interact.
    $placeholder.data('gmap', {map: map, conf: c});
    $placeholder.trigger("gmap.initialized", [map, c]);

  }

  google.maps.event.addDomListener(window, 'load', init);
}