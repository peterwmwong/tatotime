cell.define ->
  initialize: ->
    @options.columns ?= ['network','title']

    @options.categories ?=
        '7:00':'7:00'
        '7:30':'7:30'
        '8:00':'8:00'

    @options.getMembers ?= do->
        make = (net,title)->
          network: net
          title: title
        (cat,m)->[
          make('ABC','Dancing With the Stars (US)')
          make('FOX','House')
          make('CBS','How I Met Your Mother')
        ]
    @_categoryNames = (k for k,v of @options.categories)

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
    <table>
      <tbody>
        #{R @_categoryNames, (cat)=>
            catMembers = @options.getMembers cat, @model
            R catMembers?.length > 0 and "
              #{R numRenderedGroups++ > 0 and "
                <tr class='categorySpacer'>
                  <td colspan='#{(@options.columns?.length or 0)+2}'> </td>
                </tr>
              "}
              <tr class='category #{oddEven()}'>
                <td rowspan='#{catMembers.length or 0}' id='header' class='#{cat}'>
                  <span>#{@options.categories[cat]}</span>
                </td>
                #{R catMembers, (member,i)=> "
                  #{R i!=0 and "
                    <tr class='#{oddEven()}'>
                  "}
                    <td class='colSpacer'> </td>
                    #{R @options.columns, (col)=>"
                      <td class='col #{col}'>#{member[col]}</td>
                    "}
              </tr>
                "}
        "}
    """

