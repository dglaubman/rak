$ ->
  # $('html').addClass(if $.fn.details.support then 'details' else 'no-details')
  # $('details').details()
  #
  semver = "0.1.1"            # Semantic versioning - semver.org
  # Polyfill a given set of elements
  $('details').details()
  log = new Log( $("#console") )

  # Hook up controls on page
  $("#disconnect").on 'click', (evt) ->
    comm.disconnect()

  $(".engine").on 'click', (evt) ->
    comm.startEngine @textContent

  $("#clear").on 'click', ->
    log.clear()

  # Hook up controller and events for array of server widgets
  widgets = new Controller
  widgets.stopServer = (name)  => comm.publish( config.workX, "stop #{name}", config.execQ )

  messageHandler = (m) ->
    topic = m.args.routingKey
    body = m.body.getString(Charset.UTF8)
    switch m.args.exchange
      when config.signalX
        signalDispatcher widgets, topic, body
      when config.serverX
        serverDispatcher widgets, topic, body
    log.write body

  comm = new Communicator( log, messageHandler )
  comm.connect config, config.credentials
