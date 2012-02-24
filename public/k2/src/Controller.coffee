class Controller
  contructor: (@widgets, @err) ->

  ready: (type, name, load) =>
    server = cache[name] ?= make( type, name )

  stopped: (name) ->

  refresh: (name, size, at) ->

  make = (type, name) ->
    next = $.inArray 1, avail
    if next isnt -1
      avail[next] = 0
      widget = $( "#id#{next}", @widgets)
      $( ".at", widget).html name
    else
      @err

  avail = [1,1,1,1,1,1,1,1]
  cache = {}
                  # server = grid[at] ? grid.error
  # server.refresh name size

# ready = (type, name, load) ->
#
#   server.updateStats load

# stopped = (name) ->
#   server = serverCache[name] ? factory.mockserver name
#   server.unhook()
#   serverCache[name] = undefined

root = exports ? window
root.Controller = Controller

