

var ctx;
var sprites = {};

var boatAngle = 0;
var boatSpeed = 0;
var boatX = 0;
var boatY = 0;

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

function drawSprite(name,x,y,angle)
{
	var image = sprites[name];
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(angle);
	ctx.translate(-0.5 * image.width,-0.5 * image.height);
	ctx.drawImage(image,0,0);
	ctx.restore();
}

function drawScene()
{
	if (getKey("left")) boatAngle -= 0.01;
	if (getKey("right")) boatAngle += 0.01;
	if (getKey("up")) boatSpeed += 0.1;
	if (getKey("down")) boatSpeed -= 0.1;

	boatX += Math.cos(boatAngle) * boatSpeed;
	boatY += Math.sin(boatAngle) * boatSpeed;

	ctx.drawImage(sprites["map"],10,10); 
	drawSprite("boat",boatX,boatY, boatAngle);

	window.requestAnimationFrame(drawScene);
}
