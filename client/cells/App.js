define(['C!./ThreeDayView', 'C!./DateNav'], function(ThreeDayView, DateNav) {
  return {
    render: function(R) {
      return "" + (R(DateNav)) + "\n" + (R(ThreeDayView));
    }
  };
});