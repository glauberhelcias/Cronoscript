/**
 * 
 * Gramatica ABNF (http://tools.ietf.org/html/rfc5234) que define uma expressao valida:
 * script =  expr *("," [SP] expr)                ; uma expressao ou uma sequencia delas
 * expr   =  [1*DIGIT %x27] 1*DIGIT DQUOTE *ALPHA ; minutos e segundos ou so segundos
 * expr   =/ 1*DIGIT %x27 *ALPHA                  ; ou so minutos
 * expr   =/ 1*DIGIT %x23 *ALPHA                  ; ou uma distancia em metros
 * expr   =/ 1*DIGIT "(" script ")"               ; ou uma repeticao sobre um script
 *
 */

var Script = function(expr) {
	var SCRIPTRULE = /((((\d+\')?\d+\")|(\d+\')|(\d+#))\w*)|(\d+\(.+\))/g;
	var IS_GRP = /\d+\(.+\)/;
	var GRP_CONTENT = /\(.+(?=\))/;
	var MIN = /\d+(?=\')/;
	var SEC = /\d+(?=\")/;
	var MTS = /\d+(?=#)/;
	var cronoarray = readcronoarray(expr);
	
	function readcronoarray(expr) {
		var tokenlist = expr.match(SCRIPTRULE);
		for (var token in tokenlist) {
			if (IS_GRP.test(tokenlist[token])) {
				var multiplicador = new Crono(tokenlist[token].match(/^\d+/)[0]);
				conteudo = tokenlist[token].match(GRP_CONTENT)[0].slice(1);
				multiplicador.x(readcronoarray(conteudo));
				tokenlist[token] = multiplicador;
			} else {
				nome = tokenlist[token].match(/\w*$/)[0];
				if (MTS.test(tokenlist[token])) {
					distancia = parseInt(tokenlist[token].match(MTS)[0]);
					tokenlist[token] = new Dist(distancia, nome);
				} else {
					tempo = 0;
					if (MIN.test(tokenlist[token])) {
						tempo += parseInt(tokenlist[token].match(MIN)[0])*60;
					}
					if (SEC.test(tokenlist[token])) {
						tempo += parseInt(tokenlist[token].match(SEC)[0]);
					}
					tokenlist[token] = new Crono(tempo, nome);
				}
			}
		}
		return tokenlist;
	};
	
	Script.prototype.getInstance = function () {
		if (cronoarray.length > 1) {
			var newcrono = new Crono(1);
			newcrono.x(cronoarray);
			return newcrono;
		}
		return cronoarray[0];
	};
	
	return this.getInstance();
};