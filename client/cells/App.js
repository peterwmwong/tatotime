(function() {
  cell.define(['./ThreeDayView'], function(ThreeDayView) {
    return {
      render: function(R) {
        return "" + (R(ThreeDayView)) + "\n<div id='footer'>\n  <div id='tatotime'>TatoTime!</div>\n</div>";
      }
    };
  });
}).call(this);
