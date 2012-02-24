root = exports ? window
root.serverDispatcher = serverDispatcher
root.exposureDispatcher = exposureDispatcher

serverCache = {}

serverDispatcher = (topic, body) ->

  # topic is
  #        [ cdl | broker ] . [ ready | stopped ]
  [ serverType, state ] = topic.split '.'

  #  body is like:
  #        name: AAA/NN, load: NN
  s =  body.replace( /\s/g, '')                 # squeeze out whitespace
  [ _1, server, _2, load ]  =  s.split /\:|,/g  # split on : and ,

  switch state

    when 'ready'
      update server load
    when 'stopped'
      remove server

update = (name, load) ->
  server = serverCache[name] ?= new server( serverType, name )
  server.updateStats load

remove = (name) ->
  server = serverCache[name] ? mockServer
  server.unhook()
  serverCache[name] = undefined


exposureDispatcher = (topic, body) ->

  # topic is
  #        [ cdl | edm ] .ready
  #
  # body is like
  #        name: AAAA/NN, size: [S | M | L], at: NN
  #
  s =  body.replace( /\s/g, '')               # squeeze out whitespace
  [ _1, name, _2, size, _3, at ]  =  s.split /\:|,/g  # split on : and ,

  server = serverCache[at] ? mockServer
  server.refresh name size
