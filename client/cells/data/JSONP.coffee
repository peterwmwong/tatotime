define ->
  jsonpID = 0

  jsonp = (options)->
    jsonpString = '__jsonp' + ++jsonpID
    window[jsonpString] = (j)->
      options.success j
      window[jsonpString] = undefined
      $('#'+jsonpString).remove()

    options.callback ?= 'callback'
    options.params ?= {}
    params = ""
    for p,v of options.params
      params += "&#{p}=#{v}"

    s = document.createElement 'script'
    s.id = jsonpString
    s.setAttribute 'type', 'text/javascript'
    s.setAttribute 'src', u = "#{options.url}#{options.url.indexOf('?') == -1 and '?' or '&'}#{options.callback}=#{jsonpString}#{params}"
    console.log 'urls:', u
    $('head').append s

  ###
  Creates a builder function for creating Service methods
  ex. A Service that gets todos could use this method as
      follows:

    Service = do->
      get = jsonp.makeget 'http://serverservice/root/'

      getTodos: get 'todos'
      getTodo:  get (todoid)-> "todos/#{todoid}"

    Service.getTodos (todos)-> # do stuff with todos
    Service.getTodo 1234, (todo)-> # do stuff with todo #1234
  ###
  jsonp.makeget = (baseurl,{callback,process})->
    callback?='callback'
    process?=(result)->result
    (pathFunc)->
      if typeof pathFunc == 'string'
        path = pathFunc
        pathFunc = -> path
      (args...,done)->
        jsonp
          callback: callback
          url: "#{baseurl}#{pathFunc args...}"
          success: (dataArray)-> done process dataArray
        return
 
  jsonp

