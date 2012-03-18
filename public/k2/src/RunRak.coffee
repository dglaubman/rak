$ ->

  semver: "0.1.0"

  runRak = ->

    log = new Log $(".console")
    Log.MaxLines = 2
    log.write "click on an engine"

    messageHandler = (m) ->
      topic = m.args.routingKey
      body = m.body.getString(Charset.UTF8)
      switch m.args.exchange
        when config.signalX
          signalDispatcher rakController, topic, body
        when config.serverX
          serverDispatcher rakController, topic, body

    comm = new Communicator log, messageHandler
    rakController = new RakController comm

    config = {
      serverX: 'serverX'
      workX:   'workX'
      signalX: 'signalX'
      execQ:   'execQ'
      url:     'ws://cadt0734.rms.com:8001/amqp'
      virtualhost:  '/'
    }

    credentials = { username: 'guest', password: 'guest' }

    comm.connect config, credentials

  root = exports ? window
  root.runRak = runRak

  class RakController
    constructor: (comm, signalTemplate) ->
      @i = 0
      @svg = d3.select("#chart")
      @links = @svg.selectAll("line.link")
      @nodes = @svg.selectAll("g.node")
      @nodes.on "click", (d,i) ->
          if d.fixed
            msg =
              ver: "0.1.0"
              id: 23
              rakIds: [ 37 ]
              payload:
                src: 'Start'
                status: 'Started'
            comm.startRak msg, 'Start'

    ready: (type, name, load) ->

    stopped: (name) ->
      @links

    dataReady: (text, at) ->
      server = cache[at]
      server?.dataReady text

    stopServer: (event) -> alert "please set action for Controller.stopServer"
