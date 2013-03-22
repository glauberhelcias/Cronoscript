/**
 * 
 */

function select(name, arr) {
	t = '<select id="' + name + '"><option selected="selected" value="';
	for(var j=0;j<arr.length-1;j++) {
		t += arr[j] + '">' + arr[j] + '</option><option value="';
	}
	return t + arr[j] + '">' + arr[j] + '</option></select>';
}

var FRMSTEPHTML = select("minutos",[0,1,2,3,4,5,6,7,8,9,10,15,20,25,30,60]) + '&prime;&nbsp;' + select("segundos",[0,1,2,3,4,5,10,15,20,25,30,35,40,45,50,55]) + '&Prime;<br><input type="text" size="13" id="titulo"><br>';
var FRMSERIESHTML = select("multiplica",[0,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) + '<br>';
var FRMDISTHTML = select("distancia",[0,100,200,300,400,500,1000,1500,2000,2500,3000,3500,4000]) + '<br>'; 
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

var Formulario = function(name, html_element) {
	this.name = name;
	this.element = html_element;
	this.statichtml = "";
	this.display = function () {
		document.getElementById(this.element).innerHTML = this.statichtml;
	};
};

var frmEdit = new Formulario("frmEdit", "editFrm");

var setbtn = document.createElement("a");
	setbtn.onclick = function () {
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
	};

var ctrlbtn = document.createElement("a");
	ctrlbtn.onclick = function () {
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
	};

status.observers.push( 
	function () {
		frmEdit.statichtml = "";
		switch (status.get())
		{
		case CHOICE:
			ctrlbtn.textContent = "Series";
			setbtn.textContent = "Step";
			break;
		case EDIT_STEP_TIME:
			ctrlbtn.textContent = "Ok";
			setbtn.textContent = "Dist";
			frmEdit.statichtml  = FRMSTEPHTML;
			break;
		case EDIT_SERIES:
			ctrlbtn.textContent = "Ok";
			setbtn.textContent = "AutoPause";
			frmEdit.statichtml = FRMSERIESHTML;
			break;
		case EDIT_STEP_DIST:
			ctrlbtn.textContent = "Ok";
			setbtn.textContent = "Time";
			frmEdit.statichtml = FRMDISTHTML;
			break;
		case UNFINISHED_SERIES:
			ctrlbtn.textContent = ")";
			setbtn.textContent = "Add";
			break;
		case READY:
			ctrlbtn.textContent = "Play";
			setbtn.textContent = "Add";
			break;
		case PAUSED:
			ctrlbtn.textContent = "Play";
			setbtn.textContent = "Reset";
			break;
		case RUNNING:
			ctrlbtn.textContent = "Pause";
			setbtn.textContent = "Abort";
			break;
		}
		frmEdit.display();
	}
);

function emptyscript () {
	return false;
};

function init() {
	document.getElementById("secndBtn").appendChild(ctrlbtn);
	document.getElementById("firstBtn").appendChild(setbtn);
	status.set(CHOICE);
}
