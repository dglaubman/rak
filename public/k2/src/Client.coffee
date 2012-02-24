$ ->

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
    client = new Communicator( log )
    tenant =   " on " + virtualhost.value
    log "CONNECTING: " + url.value + " " + username.value + tenant
    client.onmessage = (m) =>
      s = m.body.getString(Charset.UTF8)
      log "CONSUME: <strong> " + s + "</strong>"
      m.body.rewind()

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
