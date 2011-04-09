(function() {
  cell.define(['./ThreeDayView'], function(ThreeDayView) {
    return {
      render: function(R) {
        return R(ThreeDayView);
      }
    };
  });
}).call(this);
