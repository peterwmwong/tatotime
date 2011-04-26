define(['C!./ThreeDayView'], function(ThreeDayView) {
  if (typeof $ == "function") {
    $('head').append("    <link href='http://fonts.googleapis.com/css?family=Droid+Sans'          rel='stylesheet'          type='text/css'>  ");
  }
  return {
    render: function(R) {
      return "" + (R(ThreeDayView)) + "\n<div id='footer'>\n  <div id='tatotime'>TatoTime!</div>\n</div>";
    }
  };
});