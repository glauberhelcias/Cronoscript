function select(name, arr) {
	t = '<select id="' + name + '"><option selected="selected" value="';
	for(var j=0;j<arr.length-1;j++) {
		t += arr[j] + '">' + arr[j] + '</option><option value="';
	}
	return t + arr[j] + '">' + arr[j] + '</option></select>';
}

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
var display = document.createElement("div");
var secdisp = document.createElement("span");
var txtscript = "";
//var myscript = new Crono(null, null); //inicialização meramente formal, sem função
var status = {
	get: function () {
		return status.value;
	},
	set: function (param) {
		if (status.value!=param) {
			status.value = param;
			status.onchange();
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
			if (!loaded) {
				myscript = new Script(txtscript);
				loaded = true;
			}
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
	case CHOICE: //setbtn.textContent = "Step";
	case EDIT_STEP_DIST: //setbtn.textContent = "Time";
		status.set(EDIT_STEP_TIME);
		break;
	case EDIT_STEP_TIME: //setbtn.textContent = "Dist";
		status.set(EDIT_STEP_DIST);
		break;
	case EDIT_SERIES: //setbtn.textContent = "AutoPause";
		break;
	case PAUSED: //setbtn.textContent = "Reset";
		txtscript = "";
		myscript.abort();
		myscript = null;
	case UNFINISHED_SERIES: //setbtn.textContent = "Add";
	case READY: //setbtn.textContent = "Add";
		status.set(CHOICE);
		break;
	case RUNNING: //setbtn.textContent = "Abort";
		myscript.abort();		
		break;
	}
};

ctrlbtn.onclick = function () {
	txtedit = frmEdit.toString();
	switch (status.get())	
	{
	case CHOICE: //ctrlbtn.textContent = "Series";
		status.set(EDIT_SERIES);
		break;
	case EDIT_SERIES: //ctrlbtn.textContent = "Ok";
		if (txtedit) grp++;
	case EDIT_STEP_TIME: //ctrlbtn.textContent = "Ok";
	case EDIT_STEP_DIST: //ctrlbtn.textContent = "Ok";
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
	case UNFINISHED_SERIES: //ctrlbtn.textContent = ")";
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
	case READY: //ctrlbtn.textContent = "Play";
		if (txtscript!=display.textContent) {
			txtscript = display.textContent;
			loaded = false;
		}
	case PAUSED: //ctrlbtn.textContent = "Play";
		status.set(RUNNING);
		break;
	case RUNNING: //ctrlbtn.textContent = "Pause";
		status.set(PAUSED);
		break;
	}
};

/** 
 * como e onde serao apresentados os digitos do cronometro a cada tique do relogio
 */
Crono.prototype.displayActions.push(
	function (obj, beep) { 
		if (obj instanceof Dist) {
			display.className = "display running dist";
			display.textContent = obj.valor_distancia;
		} else {
			display.className = "display running";
			if (obj.valor>59) {
				display.textContent = Math.floor(obj.valor/60) + ":";
				if (obj.valor%60<10) display.textContent += "0";
				display.textContent += obj.valor%60;
				
			} else {
				display.className = "display running sec";
				display.textContent = obj.valor;
			}
		}
		secdisp.textContent = obj.nome;
		if (obj.remtimes>0) secdisp.textContent += " +" + obj.remtimes;
		if (beep) {
			display.className += " beep";
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
		display.className = "display";
		secdisp.textContent = "";
	}
);

function appinit() {
	display.className = "display";
	secdisp.className = "display";
	document.getElementById("firstBtn").appendChild(setbtn);
	document.getElementById("secndBtn").appendChild(ctrlbtn);
	document.getElementById("editFrm").appendChild(frmEdit);
	document.getElementById("myDisplay").appendChild(display);
	document.getElementById("myDisplay").appendChild(secdisp);
	status.set(CHOICE);
};

window['appinit'] = appinit;
