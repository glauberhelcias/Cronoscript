/**
 * 
 */

var FRMSTEPHTML = '<select id="minutos"><option selected="selected" value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select>&prime;&nbsp;<select id="segundos"><option selected="selected" value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="20">20</option><option value="30">30</option></select>&Prime;<br><input type="text" size="13" id="titulo"><br><input type="radio" name="tipo" value="contador" checked="checked" onclick="javascript:frmEditUpdt()">Contador<br><input type="radio" name="tipo" value="multiplicador" onclick="javascript:frmEditUpdt()">Multiplicador<br><a href="javascript:btnInputPress()" >Ok</a>';
var FRMSERIESHTML = '<select id="multiplica"><option selected="selected" value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select><br><input type="radio" name="tipo" value="contador" onclick="javascript:frmEditUpdt()">Contador<br><input type="radio" name="tipo" checked="checked" value="multiplicador" onclick="javascript:frmEditUpdt()">Multiplicador<br><a href="javascript:btnInputPress()" >Ok</a>';
var CHOICE            = 0;
var EDIT_STEP_TIME    = 1;
var EDIT_SERIES       = 2;
var EDIT_STEP_DIST    = 3;
var UNFINISHED_SERIES = 4;
var READY             = 5;
var RUNNING           = 6;
var PAUSED            = 7;
var Control = function() {
	this.observers = new Array();
	this.notify = function () {
		for (var i=0;i<this.observers.length;this.observers[i](),i++);
	};
	this.set = function (param) {
		if (this.value!=param) {
			this.value = param;
			this.notify();
		}
	};
	this.get = function () {
		return this.value;
	};
};

var grp = 0;
var status = new Control();

var Botao = function(name, html_element) {
	this.name = name;
	this.element = html_element;
	this.caption = "";
	this.click = function () {
		for (var i=0;i<this.perform.length;this.perform[i](this),i++);
	};
	this.perform = new Array();
	this.display = function () {
		document.getElementById(this.element).innerHTML = '<a href="javascript:' + this.name + '.click()" >'+ this.caption +'</a>';
	};
};

var Formulario = function(name, html_element) {
	this.name = name;
	this.element = html_element;
	this.statichtml = "";
	this.display = function () {
		document.getElementById(this.element).innerHTML = this.statichtml;
	};
};

var frmEdit = new Formulario("frmEdit", "editFrm");
var ctrlbtn = new Botao("ctrlbtn", "secndBtn");
var setbtn = new Botao("setbtn", "firstBtn");

status.observers.push( 
	function () {
		frmEdit.statichtml = "";
		switch (status.get())
		{
		case CHOICE:
			ctrlbtn.caption = "Series";
			setbtn.caption = "Step";
			break;
		case EDIT_STEP_TIME:
			ctrlbtn.caption = "Ok";
			setbtn.caption = "Dist";
			frmEdit.statichtml  = FRMSTEPHTML;
			break;
		case EDIT_SERIES:
			ctrlbtn.caption = "Ok";
			setbtn.caption = "AutoPause";
			frmEdit.statichtml = FRMSERIESHTML;
			break;
		case EDIT_STEP_DIST:
			ctrlbtn.caption = "Ok";
			setbtn.caption = "Time";
			break;
		case UNFINISHED_SERIES:
			ctrlbtn.caption = ")";
			setbtn.caption = "Add";
			break;
		case READY:
			ctrlbtn.caption = "Play";
			setbtn.caption = "Add";
			break;
		case PAUSED:
			ctrlbtn.caption = "Play";
			setbtn.caption = "Reset";
			break;
		case RUNNING:
			ctrlbtn.caption = "Pause";
			setbtn.caption = "Abort";
			break;
		}
		ctrlbtn.display();
		setbtn.display();
		frmEdit.display();
	}
);

function emptyscript () {
	return false;
};

ctrlbtn.perform.push(
	function () {
		switch (status.get())	
		{
		case CHOICE:
			status.set(EDIT_SERIES);
			break;
		case EDIT_STEP_TIME:
		case EDIT_SERIES:
		case EDIT_STEP_DIST:
			if (emptyscript()) {
				status.set(CHOICE);
			} else {
				//formulario.incluir_token();
				if (grp==0) {
					status.set(READY);
				} else {
					status.set(UNFINISHED_SERIES);
				}
			}
			break;
		case UNFINISHED_SERIES:
			grp--;
			//script.fechar_serie;
			if (grp==0) {
				status.set(READY);
			} else {
				status.set(UNFINISHED_SERIES);
			}
			break;
		case READY:
		case PAUSED:
			status.set(RUNNING);
			break;
		case RUNNING:
			status.set(PAUSED);
			break;
		}
	}
);

setbtn.perform.push(
	function () {
		switch (status.get())	
		{
		case CHOICE:
		case EDIT_STEP_DIST:
			status.set(EDIT_STEP_TIME);
			break;
		case EDIT_STEP_TIME:
			status.set(EDIT_STEP_DIST);
			break;
		case EDIT_SERIES:
			//insere autopause no script;
			break;
		case PAUSED:
			//reseta o script
		case UNFINISHED_SERIES:
		case READY:
			status.set(CHOICE);
			break;
		case RUNNING:
			status.set(READY);
			break;
		}
	}		
);