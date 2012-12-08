var timers = new Array();
var timelapsed = 0;

function crono(valor_inicial, nome) {
	this.valor_inicial = valor_inicial;
	this.nome = nome;
	this.valor = valor_inicial;
	this.tv = valor_inicial;
	this.sub_crono = new Array();
	this.running = false;
	this.UNIT = 1000;

/**
 * Esta funÃ§Ã£o deve ser escrita na camada de apresentaÃ§Ã£o com o uso de prototype
 * 
 * 	this.display = function display() {
 * 		if (this.valor>59) {
 * 			document.getElementById(out).innerHTML = Math.floor(this.valor/60) + ":";
 * 			if (this.valor%60<10) {
 * 				document.getElementById(out).innerHTML += "0";
 * 			}
 * 			document.getElementById(out).innerHTML += this.valor%60 + " " + this.nome;
 * 		} else {
 * 			document.getElementById(out).innerHTML = this.valor + " " + this.nome;
 * 		}
 * 	};
 */
	
/**
 * Esta funÃ§Ã£o deve ser escrita na camada de apresentaÃ§Ã£o com o uso de prototype
 * 
 * 	this.display_bip = function display_bip() {
 * 		this.display(this.valor, this.nome);
 * 		document.getElementById(out).innerHTML += "<audio autoplay=\"autoplay\"><source src=\"bip.mp3\" type=\"audio/mp3\" /><source src=\"bip.ogg\" type=\"audio/ogg\" /></audio>";
 * 	};
 */
	
/**
 * Esta funÃ§Ã£o deve ser escrita na camada de apresentaÃ§Ã£o com o uso de prototype
 * 
 * 	this.timeover = function timeover() {
 * 		document.getElementById(out).innerHTML = "--";
 * 	};
 */ 

 	this.clear = function clear() {
 		this.running=false;
 		timelapsed = 0;
 		console.log("zerado timeelapsed");
		this.timeover();
 	};

 	this.x = function x(new_crono) {
		this.sub_crono = this.sub_crono.concat(new_crono);
		this.tv = this.total_valor();
	};

	this.subtr = function subtr() {
			this.valor--;
			timelapsed++;
			console.log("timeelapsed dentro do subtr",timelapsed);
			this.display(this.valor, this.nome);
	};

	this.reset = function reset() {
			this.valor = this.valor_inicial;
			console.log("novo valor", this.valor);
			timelapsed++;
			console.log("timelapsed dentro do reset",timelapsed);
			this.display_bip(this.valor, this.nome);
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
		if (lasttime>timelapsed) { //este crono não rodou até o fim antes do último pause			
			if (timelapsed>(lasttime-this.valor)) { //este crono já havia começado antes do último pause
				//aqui vai o código que retoma a contagem
				this.valor = lasttime-timelapsed;
				var self = this; //gargalo de desempenho
				for(var p=1; p<this.valor; p++) {
					timers.push(setTimeout(function() { self.subtr(); }, (lasttime-p-timelapsed)*this.UNIT));
				}
				//timers.push(setTimeout(function() { self.reset(); }, (lasttime-this.valor-timelapsed)*this.UNIT));		
				
				
			} else { //crono vai do inicio ao fim normal
				var self = this; //gargalo de desempenho
				for(var p=1; p<this.valor; p++) {
					timers.push(setTimeout(function() { self.subtr(); }, (lasttime-p-timelapsed)*this.UNIT));
				}
				timers.push(setTimeout(function() { self.reset(); }, (lasttime-this.valor-timelapsed)*this.UNIT));
			}			
		}
	};

	this.run = function run(times, lag, lag2, delay) {
		this.valor = this.valor_inicial; //reset para o caso de abort
		if (this.sub_crono.length == 0) {
			for (var k=times; k>0; k--) {
				this.countdown(lag+lag2*k+this.valor*k+delay*(k-1));
			}
		} else {
			for (var i=0; i<times; i++) {
				for (var j=0; j<this.sub_crono.length; j++) {
					this.sub_crono[j].run(this.valor, lag+lag2+i*(this.tv+lag2+delay), this.total_sub_pre(j), this.total_sub_pos(j));
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