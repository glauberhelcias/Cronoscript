var Dist = function(valor_distancia, nome) {
	this.valor_distancia_inicial = valor_distancia;
	this.valor_distancia = valor_distancia;
	this.check_interval = 1;
	Crono.call(this, 0.01, nome);
};

	Dist.prototype = Object.create( Crono.prototype );
	
	Dist.prototype.subtr = function (lastpoint) {
		if (arguments.length==0) { 
			this.pause();
		}
		//mock obter coordenadas do ponto atual
		actualpoint = {
				latitude: -44.25231,
				longitude: -3.68715
		};
		//mockEnd
		if (lastpoint) {
			this.valor_distancia -= 3; //distance(lastpoint, actualpoint);
		}
		if (this.valor_distancia>0) {
			var self = this;
			timers.push(setTimeout(function () { self.subtr(actualpoint); }, this.check_interval*UNIT));
			this.display(this.valor_distancia, this.nome, this.remtimes);
		} else {
			this.remtimes--;
			this.valor_distancia = this.valor_distancia_inicial;
			timelapsed = parseFloat((timelapsed + 0.01).toFixed(3));
			Script.prototype.getInstance().play();
		}
	};
	
	Dist.prototype.countdown = function (lasttime) {
		if (timelapsed==0) this.remtimes++; //problema no remtimes
		var self = this;
		timers.push(setTimeout(function () { self.subtr(); }, (lasttime-timelapsed)*UNIT));
	};