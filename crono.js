var timers = new Array();
var timelapsed = 0;
var UNIT = 1000;

var Crono = function(valor_inicial, nome) {
	var isRunning = false;
	this.valor_inicial = valor_inicial;
	this.nome = nome;
	this.remtimes = 0;
	this.valor = valor_inicial;
	this.tv = valor_inicial;
	this.sub_crono = new Array();
		
	Crono.prototype.running = function (set) {
		if (arguments.length>0) isRunning = set;
		return isRunning;
	};
};
 	
	Crono.prototype.displayActions = new Array();
	
	Crono.prototype.display = function(beep) {
		for (var i=0;i<this.displayActions.length;this.displayActions[i](this, beep),i++);
	};
	
	Crono.prototype.timeOverActions = new Array();
	
	Crono.prototype.timeOver = function() {
		for (var i=0;i<this.timeOverActions.length;this.timeOverActions[i](),i++);
	};
	
	Crono.prototype.clear = function () {
		this.running(false);
		timers = new Array();
		timelapsed = 0;
		//zerar todos os remtimes
		if (this.sub_crono.length == 0) {
			this.remtimes = 0;
		} else {
			for(var m=0; m<this.sub_crono.length; m++) {
				this.sub_crono[m].remtimes = 0;
			}
		}
		this.timeOver();
 	};

 	Crono.prototype.x = function (new_crono) {
		this.sub_crono = this.sub_crono.concat(new_crono);
		this.tv = this.total_valor();
	};

	Crono.prototype.subtr = function () {
		this.valor--;
		timelapsed++;
		this.display(false);
	};

	Crono.prototype.reset = function () {
		this.valor = this.valor_inicial;
		this.remtimes--;
		timelapsed++;
		this.display(true);
	};

	Crono.prototype.total_valor = function () {
		var res = 0;
		if (this.sub_crono.length == 0) {
			return valor;
		} else {
			for(var m=0; m<this.sub_crono.length; m++) {
				res = res + this.sub_crono[m].tv;
			}
			return this.valor * res;
		}
	};

	Crono.prototype.total_sub_pre = function (pre) {
		var res = 0;
		if (this.sub_crono.length == 0) {
			return valor;
		} else {
			for(var r=0; r<pre; r++) {
				res = res + this.sub_crono[r].tv;
			}
			return res;
		}
	};

	Crono.prototype.total_sub_pos = function (pos) {
		var res = 0;
		if (this.sub_crono.length == 0) {
			return valor;
		} else {
			for(var q=pos+1; q<this.sub_crono.length; q++) {
				res = res + this.sub_crono[q].tv;
			}
			return res;
		}
	};

	Crono.prototype.countdown = function (lasttime) {
		if (Math.round(timelapsed)>(lasttime-this.valor_inicial)) {
			var self = this;
			for(var p=1; p<this.valor; p++) {
				timers.push(setTimeout(function() { self.subtr(); }, Math.round(lasttime-p-timelapsed)*UNIT));
			}
		} else {
			if (timelapsed==0) this.remtimes++;
			var self = this;
			for(var p=1; p<this.valor_inicial; p++) {
				timers.push(setTimeout(function() { self.subtr(); }, Math.round(lasttime-p-timelapsed)*UNIT));
			}
			timers.push(setTimeout(function() { self.reset(); }, Math.round(lasttime-this.valor_inicial-timelapsed)*UNIT));
		}
	};
	
	Crono.prototype.abort = function () {
		this.pause();
		this.clear();
	};
		
	Crono.prototype.run = function (times, lag, lag2, delay) {
		if (this.sub_crono.length == 0) {
			for (var k=times; k>0; k--) {
				lasttime = parseFloat((lag+lag2*k+this.valor_inicial*k+delay*(k-1)).toFixed(3));
				if (lasttime>timelapsed) {
					this.countdown(Math.round(lasttime));
				}
			}
		} else {
			for (var i=0; i<times; i++) {
				for (var j=0; j<this.sub_crono.length; j++) {
					this.sub_crono[j].run(this.valor_inicial, lag+lag2+i*(this.tv+lag2+delay), this.total_sub_pre(j), this.total_sub_pos(j));
				}
			}
		}
	};
	
	Crono.prototype.pause = function () {
		this.running(false);
		for(;timers.length>0;clearTimeout(timers.pop()));
	};

	Crono.prototype.play = function () {
		this.running(true);
		this.run(1,0,0,0);
		var self = this;
		timers.push(setTimeout(function () { self.clear(); }, Math.round(this.tv-timelapsed)*UNIT));
	};
