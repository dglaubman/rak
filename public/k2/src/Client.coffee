$ ->

  class Client

    constructor: (@log) ->
      @amqp = new AmqpClient
      @amqp.addEventListener "close", =>
        @log "DISCONNECTED"

    connect: ( url, virtualhost, credentials ) ->
      @amqp.connect url, virtualhost, credentials, "0-9-1" ,
        (openEvent) =>
          @log "CONNECTED"
          @channelsReady = 0
          @publishChannel = @amqp.openChannel @publishChannelOpenHandler, @errorHandler
          @exposureChannel = @amqp.openChannel @exposureChannelOpenHandler, @errorHandler
          @serverChannel = @amqp.openChannel @serverChannelOpenHandler, @errorHandler


    disconnect:  =>
      @amqp.disconnect()

    publish:  ( exchange, text, routingKey ) =>
      body = new ByteBuffer()
      body.putString text, Charset.UTF8
      body.flip()
      headers = {}
      @publishChannel.publishBasic body, headers, exchange, routingKey, false, false

    startServer: (name) =>
      @publish 'workX', "start #{name}", 'exec'

    stopServer: (name) =>
      @publish 'workX', "stop #{name}", 'exec'

    flow: ( onOff ) =>
      @exposureChannel.flowChannel onOff
      @serverChannel.flowChannel onOff

    errorHandler: (evt) =>
      @log "Error: " + evt.type

    onmessage: (msg) =>
      @log "#{msg.args.routingKey}> #{msg.body.getString( Charset.UTF8 )}"

    channelOpenHandler: (channel, exchange, type, label) =>
      @log "open '#{exchange}' channel ok"
      channel.declareExchange exchange, type, false, false, false
      channel.addEventListener "declareexchange", =>
        @log "declare '#{exchange}' exchange ok"
      channel.addEventListener "close", =>
        @log "close '#{exchange}' channel ok"
      @channelsReady++
      @doBind()  if @channelsReady is 3

    publishChannelOpenHandler: (evt) =>
      @channelOpenHandler evt.channel, 'workX', 'direct'

    exposureChannelOpenHandler: (evt) =>
      @channelOpenHandler evt.channel, 'exposures', 'topic'

    serverChannelOpenHandler: (evt) =>
      @channelOpenHandler evt.channel, 'servers', 'topic'

    listen: (channel, event, label) =>
      channel.addEventListener event, =>
        @log "#{event} for '#{label}' ok"

    doBind: =>
      @listen @exposureChannel, "declarequeue", "exposure"
      @listen @serverChannel,   "declarequeue", "servers"
      @listen @exposureChannel, "bindqueue",    "exposure"
      @listen @serverChannel,   "bindqueue",    "servers"
      @listen @exposureChannel, "subscribe",    "exposure"
      @listen @serverChannel,   "subscribe",    "servers"

      @exposureChannel.onmessage = @onmessage
      @serverChannel.onmessage = @onmessage
      eQName = "exposureQ#{new Date().getTime()}"
      sQName = "serverQ#{new Date().getTime()}"

      passive = durable = autoDelete = noWait = exclusive = noLocal = noAck = true
      qArgs = null
      tag = ""

      @exposureChannel.declareQueue(eQName, not passive, not durable, exclusive, autoDelete, not noWait).
        bindQueue(eQName, 'exposures', "#", not noWait).
        consumeBasic eQName, tag, not noLocal, noAck, noWait, not exclusive
      @serverChannel.declareQueue(sQName, not passive, not durable, exclusive, autoDelete, not noWait).
        bindQueue(sQName, 'servers', "#", not noWait).
        consumeBasic sQName, tag, not noLocal, noAck, noWait, not exclusive


  console = document.getElementById("console")

  # Safari doesn't support details/summary, so using this polyfill
  $('html').addClass(if $.fn.details.support then 'details' else 'no-details')
#  $('body').prepend(if $.fn.details.support then 'Native support detected; the plugin will only add ARIA annotations and fire custom open/close events.' else 'Emulation active; you are watching the plugin in action!');

  $('details').details()

  url = document.getElementById("url")
  username = document.getElementById("username")
  password = document.getElementById("password")
  virtualhost = document.getElementById("virtualhost")

  startCdl = document.getElementById("startCdl")
  startBroker = document.getElementById("startBroker")

  clear = document.getElementById("clear")
  topicText = document.getElementById("topicText")


  smallEdmInputRate = document.getElementById("smallEdmInputRate")
  smallEdmSlider = document.getElementById("smallEdmSlider")
  smallEdmSlider.onchange = -> (smallEdmInputRate.textContent = @value)
  smallEdmSlider.onchange()

  mediumEdmInputRate = document.getElementById("mediumEdmInputRate")
  mediumEdmSlider = document.getElementById("mediumEdmSlider")
  mediumEdmSlider.onchange = -> (mediumEdmInputRate.textContent = @value)
  mediumEdmSlider.onchange()

  largeEdmInputRate = document.getElementById("largeEdmInputRate")
  largeEdmSlider = document.getElementById("largeEdmSlider")
  largeEdmSlider.onchange = -> (largeEdmInputRate.textContent = @value)
  largeEdmSlider.onchange()


  log = (message) ->
    pre = document.createElement("pre")
    pre.style.wordWrap = "break-word"
    pre.innerHTML = message
    console.insertBefore pre, console.firstChild
    console.removeChild console.lastChild  while console.childNodes.length > 500

  client = null

  connect.onclick = ->
    client = new Client( log )
    tenant =   " on " + virtualhost.value
    log "CONNECTING: " + url.value + " " + username.value + tenant
    client.onmessage = (m) =>
      body = m.body.getString(Charset.UTF8)
      log "CONSUME: <strong> " + body + "</strong>"
      body.rewind()

    credentials =
      username: username.value
      password: password.value

    client.connect url.value, virtualhost.value, credentials


  disconnect.onclick = ->
    client.disconnect()

  startCdl.onclick = ->
    client.startServer 'cdl'
  startBroker.onclick = ->
    client.startServer 'broker'


  clear.onclick = ->
    console.removeChild console.lastChild  while console.childNodes.length > 0


  hash = location.hash
#  location.href = "demo.html#amqp"  if hash is ""
  authority = location.host
  parts = authority.split(":")
  parts[1] = 8001
  ports =
    http: "80"
    https: "443"

  authority = parts[0] + ":" + (parseInt(parts[1] or ports[location.protocol]))

  url.value = location.protocol.replace("http", "ws") + "//" + authority + "/amqp"
  connect.disabled = null
  disconnect.disabled = "disabled"
  connect.click()
