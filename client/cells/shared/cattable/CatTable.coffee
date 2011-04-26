define [],->
  $?('head').append "<link href='http://fonts.googleapis.com/css?family=Anton' rel='stylesheet' type='text/css'>"
  defaultRenderCol = (colName,col,member)->col

  initialize: ->
    @_categoryNames = (k for k,v of @options.categories)
    @_colRenders = typeof(rc = @options.renderColumn == 'function') and rc or defaultRenderCol

  render: (R)->
    numRenderedGroups = 0
    oddEven = do->
      isEven = false
      r = -> (isEven = !isEven) and 'even' or 'odd'
      r.reset = -> isEven = false
      r
    """
    #{R @options.title and "
      <div class='title'>#{@options.title}</div>
    "}
    <div id='categories'>
    #{R @_categoryNames, (cat)=>
        catMembers = @options.getMembers cat, @model
        R catMembers?.length > 0 and "
          <div class='category'>
            <div class='header #{cat}'>
              <span>#{@options.categories[cat]}</span>
            </div>
            <div class='members'>
            #{R catMembers, (member)=> "
                <div class='member'>
                #{R @options.columns, (col)=>"
                  <div class='col #{col}'>#{member[col]}</div>
                "}
                </div>
            "}
            </div>
          </div>
    "}
    </div>
    """

