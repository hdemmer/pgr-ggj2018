

var ctx;
var sprites = {};

var screenWidth = 800;
var screenHeight = 600;
var scrollX = -0.5 * screenWidth;
var scrollY = -0.5 * screenHeight;

var scrollRubber = 0.3;

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
	ctx.translate(x - scrollX, y - scrollY);
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

	var boatCos = Math.cos(boatAngle);
	var boatSin = Math.sin(boatAngle);

	boatX += boatCos * boatSpeed;
	boatY += boatSin * boatSpeed;

	if (boatX > scrollX + (0.5 + scrollRubber) * screenWidth)
	{
		scrollX = boatX - (0.5 + scrollRubber) * screenWidth;
	}
	if (boatX < scrollX + (0.5 - scrollRubber) * screenWidth)
	{
		scrollX = boatX - (0.5 - scrollRubber) * screenWidth;
	}
	if (boatY > scrollY + (0.5 + scrollRubber) * screenHeight)
	{
		scrollY = boatY - (0.5 + scrollRubber) * screenHeight;
	}
	if (boatY < scrollY + (0.5 - scrollRubber) * screenHeight)
	{
		scrollY = boatY - (0.5 - scrollRubber) * screenHeight;
	}

	tickWorld();

	//ctx.drawImage(sprites["map"],10,10); 
	drawSprite("map",0,0);
	drawSprite("boat_hull",boatX,boatY, boatAngle);
	drawSprite("boat_hull",boatX,boatY-8, boatAngle);

	drawSprite("boat_house",boatX-14*boatCos,boatY-14*boatSin-8, boatAngle);
	drawSprite("boat_house",boatX-14*boatCos,boatY-14*boatSin-14, boatAngle);

	drawSprite("boat_antenna",boatX+10*boatCos,boatY+10*boatSin-8, 0);

	window.requestAnimationFrame(drawScene);
}
