var timers = new Array();
var timelapsed = 0;
var UNIT = 1000;


var Crono = function(valor_inicial, nome) {
	this.valor_inicial = valor_inicial;
	this.nome = nome;
	this.remtimes = 0;
	this.valor = valor_inicial;
	this.tv = valor_inicial;
	this.sub_crono = new Array();
	this.running = false;
	
	this.run = function (times, lag, lag2, delay) {
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
	
	this.pause = function () {
		this.running = false;
		for(;timers.length>0;clearTimeout(timers.pop()));
	};

	this.play = function () {
		this.run(1,0,0,0);
		this.running = true;
		var self = this;
		timers.push(setTimeout(function () { self.clear(); }, (this.tv-timelapsed)*UNIT));
	};

};
 	
	Crono.prototype.clear = function () {
 		this.running=false;
 		timelapsed = 0;
		this.timeover();
 	};

 	Crono.prototype.x = function (new_crono) {
		this.sub_crono = this.sub_crono.concat(new_crono);
		this.tv = this.total_valor();
	};

	Crono.prototype.subtr = function () {
			this.valor--;
			timelapsed++;
			this.display(this.valor, this.nome, this.remtimes);
	};

	Crono.prototype.reset = function () {
			this.valor = this.valor_inicial;
			this.remtimes--;
			timelapsed++;
			this.display_bip(this.valor, this.nome, this.remtimes);
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
		if (lasttime>timelapsed) {
			if (timelapsed>(lasttime-this.valor_inicial)) {
				var self = this;
				for(var p=1; p<this.valor; p++) {
					timers.push(setTimeout(function() { self.subtr(); }, (lasttime-p-timelapsed)*UNIT));
				}
			} else {
				if (timelapsed==0) this.remtimes++;
				var self = this;
				for(var p=1; p<this.valor_inicial; p++) {
					timers.push(setTimeout(function() { self.subtr(); }, (lasttime-p-timelapsed)*UNIT));
				}
				timers.push(setTimeout(function() { self.reset(); }, (lasttime-this.valor_inicial-timelapsed)*UNIT));
			}			
		}
	};
	
	Crono.prototype.abort = function () {
		for(this.clear();timers.length>0;clearTimeout(timers.pop()));
	};
	

var Dist = function(valor_distancia, nome) {
	this.valor_distancia = valor_distancia;
	this.check_interval = 4;
	Crono.call(this, 0, nome);
	
	this.subtr = function (lastpoint) {
		if (this.running) { 
			this.pause();
		}
		//mock obter ponto atual
		actualpoint = {
				latitude: -44.25231,
				longitude: -3.68715
		};
		this.valor_distancia -= 10; //distance(lastpoint, actualpoint);
		//mockEnd
		if (this.valor_distancia>0) {
			var self = this;
			timers.push(setTimeout(function () { self.subtr(actualpoint); }, this.check_interval*UNIT));
		} else {
			this.remtimes--;
			this.play();
		}
		this.display(this.valor_distancia, this.nome, this.remtimes);
		console.log("Falta", this.valor_distancia, "metros");		
	};
	
	this.countdown = function (lasttime) {
		//mock obter ponto de partida
		startpoint = {
				latitude: -44.65231,
				longitude: -3.48715
		};
		//mockEnd
		this.remtimes++;
		var self = this;
		timers.push(setTimeout(function () { self.subtr(startpoint); }, (lasttime-timelapsed)*UNIT));
	};

};

	Dist.prototype = Object.create( Crono.prototype );