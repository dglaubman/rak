dag =  { version: "0.1.0" };  // semver.org

dag.states = {
    Begin: 0,
    Selecting: 1, 
    Selected: 2, 
    Final: 3
};

dag.state = dag.states.Begin;
dag.admissible = [];
dag.fromSet = [];
dag.from = function (d, i) {
    switch (dag.state) {
    case dag.states.Begin:
	dag.state = dag.states.Selecting;
	dag.admissible = [d.name];
	dag.fromSet = [d];
	d.fixed = 1;
	d.x = 0;
	d.group = 19;
	break;
    case dag.states.Selecting:
    case dag.states.Selected:
	if (dag.admissible.indexOf(d.name) < 0) 
	    return alert("Multiple roots not supported.");
	dag.fromSet.push( d );
	dag.state = dag.states.Selecting;
	d.fixed = 1;
	break;
    default:
//	alert( "d'oh -- illegal state");
    }
    return d;
};   

dag.to = function (d, i) {
    switch (dag.state) {
    case dag.states.Selecting:
	dag.state = dag.states.Selected;
	dag.admissible.push(d.name);
	d.fixed = 1;
	break;
    default:// alert( " Illegal state: " + dag.state);
    }
    var temp = dag.fromSet.slice(0);
    dag.fromSet = [];
    return temp;
};
