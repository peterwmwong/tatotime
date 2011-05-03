define [], do->
  $?('head').append "<link href='http://fonts.googleapis.com/css?family=Anton' rel='stylesheet' type='text/css'/>"
  ->
    DefaultMember = C.extend
      'render <div class="member">': (R)->
        R @options.columns, (col)=>
          "<div class='col #{col}'>#{@model[col]}</div>"
    DefaultCategory = C.extend
      'render <span>': -> "#{@options.category}"

    initialize: ->
      @_categoryNames = (k for k,v of @options.categories)
      @options.memberCell ?= DefaultMember
      @options.categoryCell ?= DefaultCategory

    render: (R)->
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
                #{R @options.categoryCell, category: cat}
              </div>
              <div class='members'>
                #{R catMembers, (member)=>R @options.memberCell, model:member, columns:@options.columns}
              </div>
            </div>
      "}
      </div>
      """

