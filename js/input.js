
var inputKeys = [];

function absorbEvent_(event) {
    var e = event || window.event;
    e.preventDefault && e.preventDefault();
    e.stopPropagation && e.stopPropagation();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
}

function initInput(){
    document.addEventListener("keydown", press, false);
    document.addEventListener("keyup", release, false);

    document.addEventListener("touchstart", press, false);
    document.addEventListener("touchend", release, false);

    document.addEventListener("touchstart", absorbEvent_, false);
    document.addEventListener("touchend", absorbEvent_, false);
}

var keyMap = {"left":65,"up":87,"right":68,"down":83,"t":84};

function getKey(key)
{
	var index = keyMap[key];
	return inputKeys[index];
}

function press(event){
    var e = event || window.event;

    if (inputKeys.length < e.keyCode)
    {
    	inputKeys.length = e.keyCode;
    }

    inputKeys[e.keyCode] = true;

    if(e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
    }
}

function release(event)
{
	var e = event || window.event;

    if (inputKeys.length < e.keyCode)
    {
    	inputKeys.length = e.keyCode;
    }

	inputKeys[e.keyCode] = false;
}

initInput();