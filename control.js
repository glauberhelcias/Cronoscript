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

function emptyscript () {
	return false;
};

var IDMINUTOS = "minutos";
var IDSEGUNDOS = "segundos";
var IDTITULO = "titulo";
var IDMULTIPLICA = "multiplica";
var IDDISTANCIA = "distancia";
var FRMSTEPHTML = select(IDMINUTOS,[0,1,2,3,4,5,6,7,8,9,10,15,20,25,30,60]) + '&prime;&nbsp;' + select(IDSEGUNDOS,[0,1,2,3,4,5,10,15,20,25,30,35,40,45,50,55]) + '&Prime;<br><input type="text" size="13" id="' + IDTITULO + '"><br>';
var FRMSERIESHTML = select(IDMULTIPLICA,[0,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) + '<br>';
var FRMDISTHTML = select(IDDISTANCIA,[0,100,200,300,400,500,1000,1500,2000,2500,3000,3500,4000]) + '<br><input type="text" size="13" id="' + IDTITULO + '"><br>';
var CHOICE            = 0;
var EDIT_STEP_TIME    = 1;
var EDIT_SERIES       = 2;
var EDIT_STEP_DIST    = 3;
var UNFINISHED_SERIES = 4;
var READY             = 5;
var RUNNING           = 6;
var PAUSED            = 7;
var grp = 0;
var frmEdit = document.createElement("span");
var ctrlbtn = document.createElement("a");
var setbtn = document.createElement("a");
var display = document.createElement("span");
var txtscript = "";
var myscript = null;
var status = {
	get: function () {
		return this.value;
	},
	set: function (param) {
		if (this.value!=param) {
			this.value = param;
			this.onchange();
		}
	},
	onchange: function () {
		frmEdit.innerHTML = "";
		switch (status.get())
		{
		case CHOICE:
			ctrlbtn.textContent = "Series";
			setbtn.textContent = "Step";
			break;
		case EDIT_STEP_TIME:
			ctrlbtn.textContent = "Ok";
			setbtn.textContent = "Dist";
			frmEdit.innerHTML  = FRMSTEPHTML;
			break;
		case EDIT_SERIES:
			ctrlbtn.textContent = "Ok";
			setbtn.textContent = "AutoPause";
			frmEdit.innerHTML = FRMSERIESHTML;
			break;
		case EDIT_STEP_DIST:
			ctrlbtn.textContent = "Ok";
			setbtn.textContent = "Time";
			frmEdit.innerHTML = FRMDISTHTML;
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
			myscript.pause();
			break;
		case RUNNING:
			ctrlbtn.textContent = "Pause";
			setbtn.textContent = "Abort";
			if (!myscript) myscript = new Script(txtscript);
			myscript.play();
			break;
		}
	}
};

frmEdit.toString = function () {
	switch (status.get())
	{
	case EDIT_STEP_TIME:
		min = frmEdit.children[IDMINUTOS].value;
		sec = frmEdit.children[IDSEGUNDOS].value;
		dig = ((min!="0")?(min + "'"):"")+((sec!="0")?(sec + '"'):"");
		return (dig!="")?(dig + frmEdit.children[IDTITULO].value):"";
	case EDIT_SERIES:
		mult = frmEdit.children[IDMULTIPLICA].value;
		return (mult!="0")?(mult + "("):"";
	case EDIT_STEP_DIST:
		dist = frmEdit.children[IDDISTANCIA].value;
		return (dist!="0")?(dist + "#" + frmEdit.children[IDTITULO].value):"";
	default:
		return "";
	}
};

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
		myscript = null;
		txtscript = "";
		display.textContent = "";
	case UNFINISHED_SERIES:
	case READY:
		status.set(CHOICE);
		break;
	case RUNNING:
		status.set(READY);
		break;
	}
};

ctrlbtn.onclick = function () {
	txtedit = frmEdit.toString();
	switch (status.get())	
	{
	case CHOICE:
		status.set(EDIT_SERIES);
		break;
	case EDIT_SERIES:
		if (txtedit) grp++;
	case EDIT_STEP_TIME:
	case EDIT_STEP_DIST:
		if ((display.textContent)||(txtedit)) {
			if (txtedit&&display.textContent&&(display.textContent.slice(-1)!="(")) display.textContent += ",";
			display.textContent += txtedit;
			if (grp==0) {
				status.set(READY);
			} else {
				status.set(UNFINISHED_SERIES);
			}
		} else {
			status.set(CHOICE);
		}
		break;
	case UNFINISHED_SERIES:
		grp--;
		if (display.textContent.slice(-1)=="(") {
			display.textContent = display.textContent.replace(/\,?\d+\($/,"");
		} else {
			display.textContent += ")";
		}
		if (grp==0) {
			if (display.textContent) { 
				status.set(READY);
			} else {
				status.set(CHOICE);
			}
		} else {
			status.set(UNFINISHED_SERIES);
		}
		break;
	case READY:
		if (!txtscript) txtscript = display.textContent;
		display.textContent = txtscript;
	case PAUSED:
		status.set(RUNNING);
		break;
	case RUNNING:
		status.set(PAUSED);
		break;
	}
};

/** 
 * como e onde serao apresentados os digitos do cronometro
 */
Crono.prototype.displayActions.push(
	function (obj, beep) { 
		display.id = "time";
		if (obj instanceof Dist) {
			display.innerHTML = obj.valor_distancia + "<br>" + obj.nome;
		} else {
			if (obj.valor>59) {
				display.textContent = Math.floor(obj.valor/60) + ":";
				if (obj.valor%60<10) display.textContent += "0";
				display.innerHTML += obj.valor%60 + "<br>" + obj.nome;
			} else {
				display.id = "time_sec";
				display.innerHTML = obj.valor + "<br>" + obj.nome;
			}
		}
		if (obj.remtimes>0) display.innerHTML += " +" + obj.remtimes;
		if (beep) {
			display.id = "time_beep";
		}
	}
);
 
/** 
 * o script encerra ou eh abortado
 */
Crono.prototype.timeOverActions.push(
	function () {
		status.set(READY);
		display.textContent = txtscript;
	}
);

function init() {
	document.getElementById("firstBtn").appendChild(setbtn);
	document.getElementById("secndBtn").appendChild(ctrlbtn);
	document.getElementById("editFrm").appendChild(frmEdit);
	document.getElementById("myDisplay").appendChild(display);
	status.set(CHOICE);
};
