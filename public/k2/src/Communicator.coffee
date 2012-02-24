class Communicator

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

root = exports ? window
root.Communicator = Communicator

