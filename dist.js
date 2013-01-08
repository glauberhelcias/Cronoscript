var Dist = function(valor_distancia, nome) {
	this.valor_distancia_inicial = valor_distancia;
	this.valor_distancia = valor_distancia;
	this.check_interval = 4;
	Crono.call(this, 0.001, nome);
};

	Dist.prototype = Object.create( Crono.prototype );
	
	Dist.prototype.subtr = function (lastpoint) {
		if (this.running()) { 
			this.pause();
		}
		//mock obter coordenadas do ponto atual
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
			this.valor_distancia = this.valor_distancia_inicial;
			timelapsed += 0.001;
			this.play(); //não está retornando para o ponto desejado do script
		}
		this.display(this.valor_distancia, this.nome, this.remtimes); //necessario nova funcao display para distancias
		console.log("Falta", this.valor_distancia, "metros");		
	};
	
	Dist.prototype.countdown = function (lasttime) {
		//mock obter coordenadas do ponto de partida
		startpoint = {
				latitude: -44.65231,
				longitude: -3.48715
		};
		//mockEnd
		this.remtimes++;
		var self = this;
		timers.push(setTimeout(function () { self.subtr(startpoint); }, (lasttime-timelapsed)*UNIT));
	};