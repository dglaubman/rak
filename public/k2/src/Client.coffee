$ ->
  # $('html').addClass(if $.fn.details.support then 'details' else 'no-details')
  # $('details').details()

  log = new Log( $("#console") )

  # Hook up controls on page
  $("#disconnect").click ->
    comm.disconnect()
  $("#startCdl").click ->
    comm.startServer 'cdl'
  $("#startTrigger").click ->
    comm.startServer 'trigger'
  $("#clear").click ->
    log.clear()

  # Range sliders control rate of simulated uploads

  intervalIds = { }
  $(".left").on 'change', "input[type='range']", (event) ->
    rate = parseInt( @value, 10 )
    $(this).siblings('span').children('label').html rate
    edm = @dataset['size']
    clearInterval intervalIds[edm] if intervalIds[edm]
    intervalIds[edm] = every 60000 / rate, ( -> comm.sendWork edm )

  # Hook up controller and events for array of server widgets
  widgets = new Controller
  widgets.stopServer = (name)  => comm.publish( 'workX', "stop #{name}", 'exec' )

  messageHandler = (m) ->
    topic = m.args.routingKey
    body = m.body.getString(Charset.UTF8)
    switch m.args.exchange
      when 'exposures'
        exposureDispatcher widgets, topic, body

      when 'servers'
        serverDispatcher widgets, topic, body
    log.write body

  comm = new Communicator( log, messageHandler )

  credentials =
    username: $("#username").val()
    password: $("#password").val()

  virtualhost = $("#virtualhost").val()

  [host, port] = location.host.split ':'
  # override port
  port = $("#port").val()
  url = location.protocol.replace("http", "ws") + "//" + host + ":" + port + "/amqp"

  comm.connect url, virtualhost, credentials
