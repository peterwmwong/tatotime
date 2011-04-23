(function() {
  cell.define(['./ThreeDayView', 'data/ShowService', 'shared/cattable/CatTable'], function(ThreeDayView) {
    $('head').append("<link href='http://fonts.googleapis.com/css?family=Droid+Sans' rel='stylesheet' type='text/css'>");
    return {
      render: function(R) {
        return "" + (R(ThreeDayView)) + "\n<div id='footer'>\n  <div id='tatotime'>TatoTime!</div>\n</div>";
      }
    };
  });
}).call(this);
