# Dispatches messages from 'servers' exchange to view
serverDispatcher = (controller, topic, body) ->

  # topic :=   [ cdl | broker ] . [ ready | stopped ]
  [ serverType, state ] = topic.split '.'

  switch state

    when 'ready'
      #  body :=   name: AAA/NN, load: NN
      s =  body.replace( /\s/g, '')               # squeeze out whitespace
      [ _1, name, _2, load ]  =  s.split /\:|,/g  # split on : and ,
      controller.ready serverType, name, load

    when 'stopped'
      controller.stopped body

# Dispatches messages from 'exposures' exchange to view
exposureDispatcher = (controller, topic, body) ->

  # body :=  name: ALPHANUM/NUM, size: [S | M | L], at: ALPHANUM/NUM
  s =  body.replace( /\s/g, '')               # squeeze out whitespace
  [ _1, name, _2, size, _3, at ]  =  s.split /\:|,/g  # split on : and ,

  switch topic

    when 'cdl.ready'
      controller.dataReady( name,  size, at )

root = exports ? window
root.serverDispatcher = serverDispatcher
root.exposureDispatcher = exposureDispatcher

