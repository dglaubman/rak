$ ->

  class Client
    constructor: (@log) ->
      @amqp = new AmqpClient
      @amqp.addEventListener "close", =>
        updateConnectionButtons false
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

    publish:  ( exchange, text ) =>
      body = new ByteBuffer()
      body.putString text, Charset.UTF8
      body.flip()
      headers = {}
      @publishChannel.publishBasic body, headers, exchange, routingKey, false, false

    flow: ( onOff ) =>
      @exposureChannel.flowChannel onOff
      @serverChannel.flowChannel onOff

    errorHandler: (evt) =>
      @log "Error: " + evt.type

    onmessage: (msg) =>
      @log "#{msg.args.routingKey}> #{msg.body.getString( Charset.UTF8 )}"

    channelOpenHandler: (channel, exchange, type, label) =>
      @log "open '#{label || exchange}' channel ok"
      channel.declareExchange exchange, type, false, false, false
      channel.addEventListener "declareexchange", =>
        @log "declare '#{label || exchange}' exchange ok"
      channel.addEventListener "close", =>
        @log "close '#{label || exchange}' channel ok"
      @channelsReady++
      @doBind()  if @channelsReady is 3

    publishChannelOpenHandler: (evt) =>
      @channelOpenHandler evt.channel, exchangeName, exchangeTypeName, 'publish'
      updateConnectionButtons true

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
      updateConnectionButtons true


  console = document.getElementById("console")

  url = document.getElementById("url")
  username = document.getElementById("username")
  password = document.getElementById("password")
  virtualhost = document.getElementById("virtualhost")

  connect = document.getElementById("connect")
  disconnect = document.getElementById("disconnect")

  clear = document.getElementById("clear")
  publishExchange = document.getElementById("publishExchange")
  messagetext = document.getElementById("messagetext")
  exchangeType = document.getElementById("exchangeType")
  topicText = document.getElementById("topicText")

  send = document.getElementById("send")
  flowOn = document.getElementById("flowOn")
  flowOff = document.getElementById("flowOff")

  exchangeName = publishExchange.value
  exchangeTypeName = exchangeType.value
  routingKey = topicText.value

  log = (message) ->
    pre = document.createElement("pre")
    pre.style.wordWrap = "break-word"
    pre.innerHTML = message
    console.insertBefore pre, console.firstChild
    console.removeChild console.lastChild  while console.childNodes.length > 500

  updateConnectionButtons = (connected) ->
    connect.disabled = connected
    disconnect.disabled = not connected
    send.disabled = not connected
    flowOn.disabled = not connected
    flowOff.disabled = not connected

  updateConnectionButtons false
  client = new Client( log )
  client.onmessage = (m) =>
     body = m.body.getString(Charset.UTF8)
     log "CONSUME: <strong> " + body + "</strong>"
  connect.onclick = ->
    client = new Client( log )
    tenant =   " on " + virtualhost.value
    log "CONNECTING: " + url.value + " " + username.value + tenant

    credentials =
      username: username.value
      password: password.value

    client.connect url.value, virtualhost.value, credentials

  disconnect.onclick = ->
    client.disconnect()

  send.onclick = ->
    if not messagetext.value? or messagetext.value.length is 0
      alert "Enter a valid string for message"
      return
    client.publish publishExchange.value, messagetext.value

  clear.onclick = ->
    console.removeChild console.lastChild  while console.childNodes.length > 0

  flowOn.onclick = ->
    client.flow true

  flowOff.onclick = ->
    client.flow false

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

