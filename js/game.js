

var ctx;
var sprites = {};

var boat = [0,0];

function start() {
    var canvas = document.getElementById("thecanvas");
	ctx = canvas.getContext("2d");

	var spriteElements = document.getElementsByClassName("sprite");
	for (var i = spriteElements.length - 1; i >= 0; i--) {
		var s = spriteElements[i];
		sprites[s.id] = s;
	}

    drawScene();
}

function drawScene()
{

	if (getKey("left")) boat[0] -=1;
	if (getKey("right")) boat[0] +=1;
	if (getKey("up")) boat[1] -=1;
	if (getKey("down")) boat[1] +=1;


	ctx.drawImage(sprites["map"],10,10); 
	ctx.drawImage(sprites["boat"],boat[0],boat[1]); 
	window.requestAnimationFrame(drawScene);
}
