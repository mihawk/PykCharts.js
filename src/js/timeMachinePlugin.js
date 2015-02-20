var timeMachine  = {};
timeMachine.initiate = function (data,id) {
	var that = this;
	if(!('time_machine' in data[0])) {
		return;
	}
	that.data = "heloooooooo";
	this.execute = function() {
		that.render();
	}

	this.render = function () {
		that.renderTimeMachine();
	}

	this.renderTimeMachine =  function() {
		console.log("renderTimeMachine")				
	}
}