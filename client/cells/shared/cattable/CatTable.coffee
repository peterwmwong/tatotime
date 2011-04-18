cell.define ->
  initialize: ->
    @config ?=
      columns: ['network','title']

      categories:
        '7:00':'7:00'
        '7:30':'7:30'
        '8:00':'8:00'

      getMembers: do->
        make = (net,title)->
          network: net
          title: title
        (cat,m)->[
          make('ABC','Dancing With the Stars (US)')
          make('FOX','House')
          make('CBS','How I Met Your Mother')
        ]
    @_categoryNames = (k for k,v of @config.categories)

  render: (R)->
    numRenderedGroups = 0
    oddEven = do->
      isEven = false
      -> (isEven = !isEven) and 'even' or 'odd'
    """
    <table>
      <tbody>
        #{R @_categoryNames, (cat)=>
            catMembers = @config.getMembers cat, @model
            R catMembers?.length > 0 and "
              #{R numRenderedGroups++ > 0 and "
                <tr class='categorySpacer'>
                  <td colspan='#{(@config.columns?.length or 0)+1}'> </td>
                </tr>
              "}
              <tr class='category #{oddEven()}'>
                <td rowspan='#{catMembers.length or 0}' id='header' class='#{cat}'>
                  #{@config.categories[cat]}
                </td>
                #{R catMembers, (member,i)=> "
                  #{R i!=0 and "
                    <tr class='#{oddEven()}'>
                  "}
                    <td class='colSpacer'> </td>
                    #{R @config.columns, (col)=>"
                      <td class='col #{col}'>#{member[col]}</td>
                    "}
              </tr>
                "}
        "}
    """

