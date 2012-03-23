$ ->

  semver: "0.1.0"

  runRak = ->

    log = new Log $(".console")

    messageHandler = (m) ->
      topic = m.args.routingKey
      body = m.body.getString(Charset.UTF8)
      switch m.args.exchange
        when config.signalX
          signalDispatcher controller, topic, body
        when config.serverX
          serverDispatcher controller, topic, body

    controller = new RakController log
    comm = new Communicator log, messageHandler

    comm.connect config, config.credentials, =>
      controller.init comm

  root = exports ? window
  root.runRak = runRak

  class RakController
    constructor: (@log) ->
      @rakId = Math.floor( Math.random() * 1000 )     # very short term
      @startId = 0
      @svg = d3.select("#chart")
      @links = @svg.selectAll("line.link")
      @nodes = @svg.selectAll("g.node")
      @nodes.select( (d, i) -> if d.fixed is 1 then null else this  ).remove()
      @msgs = @nodes.selectAll("text.status")
      @signalData = []
      @replay = d3.select("#signalLog")
      @replay.selectAll("a.signal").on( "click", (d,i) -> alert( "hello" ) )

    init: (@comm) ->

      @nodes.each (d,i) =>
        return @comm.startTrigger( d.name, @rakId, d.predecessors.join(',') ) if d.fixed

      @nodes.on "click", (d,i) =>
        msg =
          ver: "0.1.0"
          id: @startId
          rakIds: [ @rakId ]
          payload:
            src: 'Zurich/' + @startId++
            status: 'Started'
        @comm.startRak JSON.stringify( msg ), 'Start'

    ready: (type, name, load) ->

    stopped: (name) ->

    dataReady: (signal, msg) ->
      @signalData.push { signal: signal, msg: msg }
      @replay
          .selectAll( "a.signal")
          .data( @signalData )
        .enter()
          .insert( "a" )
          .attr( "class", "signal" )
          .attr( "href", "#" )
          .html( (d,i) -> "<h4>#{d.signal}: #{d.msg.payload.src}</h4>" )
      text = JSON.stringify msg
      @log.write "#{signal}: #{text}"
      if signal isnt 'Start'
        @nodes.select( (d,i) -> this if d.name is signal )
          .select( ".status" )
          .text( "#{msg.payload.src} is #{msg.payload.status}" )

    stopServer: (event) -> alert "please set action for Controller.stopServer"


