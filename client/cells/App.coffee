cell.define ['./ThreeDayView','data/ShowService','shared/cattable/CatTable'], (ThreeDayView)->
  $('head').append "<link href='http://fonts.googleapis.com/css?family=Droid+Sans' rel='stylesheet' type='text/css'>"
  render: (R)->
    """
    #{R ThreeDayView}
    <div id='footer'>
      <div id='tatotime'>TatoTime!</div>
    </div>
    """
