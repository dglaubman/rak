dag = version: "0.1.0"
dag.states =
  Begin: 0
  Selecting: 1
  Selected: 2
  Final: 3

dag.state = dag.states.Begin
dag.admissible = []
dag.fromSet = []
dag.from = (d, i) ->
  switch dag.state
    when dag.states.Begin
      dag.state = dag.states.Selecting
      dag.admissible = [ d.name ]
      dag.fromSet = [ d ]
      d.fixed = 1
      d.group = 19

    when dag.states.Selecting, dag.states.Selected
      return alert("Multiple roots not supported.")  if dag.admissible.indexOf(d.name) < 0
      dag.fromSet.push d
      dag.state = dag.states.Selecting
      d.fixed = 1
  d

dag.to = (d, i) ->
  switch dag.state
    when dag.states.Selecting
      dag.state = dag.states.Selected
      dag.admissible.push d.name
      d.fixed = 1
  temp = dag.fromSet.slice(0)
  dag.fromSet = []
  temp

root = exports ? window
root.dag = dag
