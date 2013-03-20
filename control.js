/**
 * 
 */

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

var Botao = function(name, html_element, caption) {
	this.name = name;
	this.element = html_element;
	this.caption = caption;
	this.click = function () {
		for (var i=0;i<this.perform.length;this.perform[i](this),i++);
	};
	this.perform = new Array();
	this.display = function () {
		document.getElementById(this.element).innerHTML = '<a href="javascript:' + this.name + '.click()" >'+ this.caption +'</a>';
	};
};

/** 
 * botao responsável por 'play/pause/)/Ok'
 */
var ctrlbtn = new Botao("ctrlbtn", "secndBtn");
var setbtn = new Botao("setbtn", "firstBtn");

status.observers.push( 
	function () {
		switch (status.get())
		{
		case CHOICE:
			ctrlbtn.caption = "Series";
			setbtn.caption = "Step";
			break;
		case EDIT_STEP_TIME:
			ctrlbtn.caption = "Ok";
			setbtn.caption = "Dist";
			break;
		case EDIT_SERIES:
			ctrlbtn.caption = "Ok";
			setbtn.caption = "AutoPause";
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

/*setbtn.perform.push(
		
);*/