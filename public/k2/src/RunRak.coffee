$ ->

  semver: "0.1.1"

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
      @svg.selectAll("g.node").select( (d,i) ->  if (d.fixed is 1)   then null else  this).remove()
      @nodes = @svg.selectAll("g.node")
      @msgs = @nodes.selectAll("text.status")
      @signalData = []
      @replay = d3.select("#signalLog")

      #   .on( "click", "button", (event) -> alert( "hello" ) )

    init: (@comm) ->

      @nodes.each (d,i) =>
        return @comm.startTrigger( d.name, @rakId, d.predecessors.join(',') ) if d.fixed

      @nodes.on "click", (d,i) =>
        msg =
          ver: @comm.semver
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
          .selectAll( "button.signal")
          .data( @signalData )
        .enter()
          .append( "button" )
          .attr( "class", "signal" )
          .on( "click", (d,i) => @comm.startRak JSON.stringify( msg ), signal )
          .text( (d,i) -> "#{d.signal}: #{d.msg.payload.src}" )
      text = JSON.stringify msg
      @log.write "#{signal}: #{text}"
      if signal isnt 'Start'
        @nodes.select( (d,i) -> this if d.name is signal )
          .select( ".status" )
          .text( "#{msg.payload.src} is #{msg.payload.status}" )
          .attr( "opacity", 0 )
          .transition()
          .duration(1200)
          .attr("opacity", 1)

    stopServer: (event) -> alert "please set action for Controller.stopServer"


