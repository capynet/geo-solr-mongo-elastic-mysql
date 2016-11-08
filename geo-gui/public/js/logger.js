/*
Very simple graphical logger
 */
var Logger = function (el) {
  this.$el = $(el);
  this.log = [];
};

Logger.prototype = {

  addItem: function (item) {
    this.log.push(item);
  },

  render: function () {
    var log = this.log;

    if (log.length) {
      var $output = $('<ul>');
      log.forEach(function (item, i) {
        var $item = $('<li>');
        $item.text(item);
        $item.appendTo($output);
      });
    }

    this.clear();
    $output.appendTo(this.$el);
  },

  clear: function () {
    this.log = [];
    this.$el.empty();
  }


};