root = exports ? window

# Set up a LIFO log
class root.Log
  constructor: (@targ) ->

  write: (message) ->
    @targ.prepend( "<pre>#{message}</pre>" )

  clear: () -> @targ.html ''