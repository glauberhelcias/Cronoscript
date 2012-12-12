var timers = new Array();
var timelapsed = 0;

function crono(valor_inicial, nome) {
	this.valor_inicial = valor_inicial;
	this.nome = nome;
	this.remtimes = 0;
	this.valor = valor_inicial;
	this.tv = valor_inicial;
	this.sub_crono = new Array();
	this.running = false;
	this.UNIT = 1000;

 	this.clear = function clear() {
 		this.running=false;
 		timelapsed = 0;
		this.timeover();
 	};

 	this.x = function x(new_crono) {
		this.sub_crono = this.sub_crono.concat(new_crono);
		this.tv = this.total_valor();
	};

	this.subtr = function subtr() {
			this.valor--;
			timelapsed++;
			this.display(this.valor, this.nome, this.remtimes);
	};

	this.reset = function reset() {
			this.valor = this.valor_inicial;
      this.remtimes--;
			timelapsed++;
			this.display_bip(this.valor, this.nome, this.remtimes);
	};

	this.total_valor = function total_valor() {
		var res = 0;
		if (this.sub_crono.length == 0) {
			return this.valor;
		} else {
			for(var m=0; m<this.sub_crono.length; m++) {
				res = res + this.sub_crono[m].tv;
			}
			return this.valor * res;
		}
	};

	this.total_sub_pre = function total_sub_pre(pre) {
		var res = 0;
		if (this.sub_crono.length == 0) {
			return this.valor;
		} else {
			for(var r=0; r<pre; r++) {
				res = res + this.sub_crono[r].tv;
			}
			return res;
		}
	};

	this.total_sub_pos = function total_sub_pos(pos) {
		var res = 0;
		if (this.sub_crono.length == 0) {
			return this.valor;
		} else {
			for(var q=pos+1; q<this.sub_crono.length; q++) {
				res = res + this.sub_crono[q].tv;
			}
			return res;
		}
	};

	this.countdown = function countdown(lasttime) {
		if (lasttime>timelapsed) {
      this.remtimes++;
			var self = this;
			if (timelapsed>(lasttime-this.valor_inicial)) {
				for(var p=1; p<this.valor; p++) {
					timers.push(setTimeout(function() { self.subtr(); }, (lasttime-p-timelapsed)*this.UNIT));
				}
			} else {
				for(var p=1; p<this.valor_inicial; p++) {
					timers.push(setTimeout(function() { self.subtr(); }, (lasttime-p-timelapsed)*this.UNIT));
				}
				timers.push(setTimeout(function() { self.reset(); }, (lasttime-this.valor_inicial-timelapsed)*this.UNIT));
			}			
		}
	};

	this.run = function run(times, lag, lag2, delay) {
		if (this.sub_crono.length == 0) {
			for (var k=times; k>0; k--) {
				this.countdown(lag+lag2*k+this.valor_inicial*k+delay*(k-1));
			}
		} else {
			for (var i=0; i<times; i++) {
				for (var j=0; j<this.sub_crono.length; j++) {
					this.sub_crono[j].run(this.valor_inicial, lag+lag2+i*(this.tv+lag2+delay), this.total_sub_pre(j), this.total_sub_pos(j));
				}
			}
		}
	};
	
	this.abort = function abort() {
		for(this.clear();timers.length>0;clearTimeout(timers.pop()));
	};
	
	this.pause = function pause() {
		this.running = false;
		for(;timers.length>0;clearTimeout(timers.pop()));
	};

	this.play = function play() {
		this.run(1,0,0,0);
		this.running = true;
		var self = this;
		timers.push(setTimeout(function () { self.clear(); }, (this.tv-timelapsed)*this.UNIT));
	};
}
