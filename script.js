/**
 * 
 * Gram�tica ABNF (http://tools.ietf.org/html/rfc5234) que define uma expressão válida:
 * script =  expr *("," [SP] expr)                ; uma expressao ou uma sequência delas
 * expr   =  [1*DIGIT %x27] 1*DIGIT DQUOTE *ALPHA ; minutos e segundos ou só segundos...
 * expr   =/ 1*DIGIT %x27 *ALPHA                  ; ...ou só minutos
 * expr   =/ 1*DIGIT "(" script ")"               ; ou uma repetição sobre um script
 *
 */

var Script = function(expr) {
	var SCRIPTRULE = /((((\d+\')?\d+\")|(\d+\'))\w*)|(\d+\(.+\))/g;
	var IS_GRP = /\d+\(.+\)/;
	var GRP_CONTENT = /\(.+(?=\))/;
	var MIN = /\d+(?=\')/;
	var SEC = /\d+(?=\")/;
	var cronoarray = readcronoarray(expr);
	
	function cronoobj(){
		if (cronoarray.length > 1) {
			var newcrono = new crono(1);
			newcrono.x(cronoarray);
			return newcrono;
		}
		return cronoarray[0];
	};
	
	function readcronoarray(expr) {
		var tokenlist = expr.match(SCRIPTRULE);
		for (var token in tokenlist) {
			if (IS_GRP.test(tokenlist[token])) {
				var multiplicador = new Crono(tokenlist[token].match(/^\d+/)[0]);
				conteudo = tokenlist[token].match(GRP_CONTENT)[0].slice(1);
				multiplicador.x(leiaTokens(conteudo));
				tokenlist[token] = multiplicador;
			} else {
				tempo = 0;
				if (MIN.test(tokenlist[token])) {
					tempo += parseInt(tokenlist[token].match(MIN)[0])*60;
				}
				if (SEC.test(tokenlist[token])) {
					tempo += parseInt(tokenlist[token].match(SEC)[0]);
				}
				nome = tokenlist[token].match(/\w*$/)[0];
				tokenlist[token] = new Crono(tempo, nome);
			}
		}
		return tokenlist;
	};

	return cronoobj();
};
