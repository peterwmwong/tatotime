define ['C!./ThreeDayView','C!./DateNav'], (ThreeDayView, DateNav)->
  render: (R)->
    """
    <div id='midcol'>
      #{R DateNav}
      #{R ThreeDayView}
    </div>
    """
