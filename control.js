/**
 * 
 */

var Botao = function(name, html_element, caption) {
	this.name = name;
	this.element = html_element;
	this.caption = caption;
	this.click = function () {
		for (var i=0;i<this.perform.length;this.perform[i](this),i++);
		this.display(); //deve ser chamado na reação do botao à troca de estado da tela, falta criar esse metodo
	};
	this.perform = new Array();
	this.display = function () {
		document.getElementById(this.element).innerHTML = '<a href="javascript:' + this.name + '.click()" >'+ this.caption +'</a>';
	};
};

var ctrlbtn = new Botao("ctrlbtn", "secndBtn", "clique");

ctrlbtn.perform.push(
	function (obj) {
		if (obj.caption == "clicou") {
			obj.caption = "clique";
		} else {
			obj.caption = "clicou";
		}
	}
);

function init() {
	ctrlbtn.display();	
}