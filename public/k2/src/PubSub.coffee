

publish = (message) ->
  body = new ByteBuffer()
  body.putString text, Charset.UTF8
  body.flip()
  headers = {}
  out.publishBasic body, headers, exchange, routingKey, false, false
