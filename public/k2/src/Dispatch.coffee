# Dispatches messages from 'servers' exchange to view
serverDispatcher = (controller, topic, body) ->

  # topic :=   [ cdl | broker ] . [ ready | stopped ]
  [ serverType, state ] = topic.split '.'

  #  body :=   name: AAA/NN, load: NN
  s =  body.replace( /\s/g, '')               # squeeze out whitespace
  [ _1, name, _2, load ]  =  s.split /\:|,/g  # split on : and ,

  switch state

    when 'ready'
      controller.ready serverType, name, load
    when 'stopped'
      controller.stopped name

# Dispatches messages from 'exposures' exchange to view
exposureDispatcher = (controller, topic, body) ->

  # topic := [ cdl | edm ] .ready
  # body :=  name: ALPHANUM/NUM, size: [S | M | L], at: ALPHANUM/NUM
  s =  body.replace( /\s/g, '')               # squeeze out whitespace
  [ _1, name, _2, size, _3, at ]  =  s.split /\:|,/g  # split on : and ,

  controller.refresh name size

root = exports ? window
root.serverDispatcher = serverDispatcher
root.exposureDispatcher = exposureDispatcher
