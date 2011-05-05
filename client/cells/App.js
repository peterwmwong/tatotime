define(['C!./ThreeDayView', 'C!./DateNav'], function(ThreeDayView, DateNav) {
  return {
    render: function(R) {
      return "<div id='midcol'>\n  " + (R(DateNav)) + "\n  " + (R(ThreeDayView)) + "\n</div>";
    }
  };
});