

var ctx;
var sprites = {};

var screenWidth = 800;
var screenHeight = 600;
var scrollX = -0.5 * screenWidth;
var scrollY = -0.5 * screenHeight;

var scrollRubber = 0.3;
var SPEED = 35;
var MIN_SPEED = -2;
var MAX_SPEED = 2;

var boatAngle = 0;
var boatSpeed = 0;
var boatX = 0;
var boatY = 0;
var trans_frame = 1;

var time = new Date().getTime() / 1000;
var deltaTime = 0;


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

function drawUISprite(name,x,y,angle)
{
	var image = sprites[name];
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(angle);
	ctx.translate(-0.5 * image.width,-0.5 * image.height);
	ctx.drawImage(image,0,0);
	ctx.restore();
}

var prevKey = "";
var boatCos = 0;
var boatSin = 0;

function processInput()
{
	if (getKey("left")) boatAngle -= 0.01;
	if (getKey("right")) boatAngle += 0.01;
	if (getKey("up")) {
		if (prevKey != "up") boatSpeed += 1;
		prevKey = "up";
	} else if (getKey("down")){
		if (prevKey != "down") boatSpeed -= 1;
		prevKey = "down";
	} else {
		prevKey = "";
	}

	if (boatSpeed > MAX_SPEED) boatSpeed = MAX_SPEED;
	if (boatSpeed < MIN_SPEED) boatSpeed = MIN_SPEED;

	boatCos = Math.cos(boatAngle);
	boatSin = Math.sin(boatAngle);

	boatX += boatCos * boatSpeed * SPEED * deltaTime;
	boatY += boatSin * boatSpeed * SPEED * deltaTime;

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
}

function drawScene()
{
	var t = new Date().getTime() / 1000;
	deltaTime = t - time;
	time = t;

	processInput();

	tickWorld();

	trans_frame = (Math.round(time * 1.9) % 4) + 1;

	//ctx.drawImage(sprites["map"],10,10); 
	drawSprite("map",0,0);
	drawSprite("boat_hull_lower",boatX,boatY, boatAngle);
	drawSprite("boat_hull",boatX,boatY-8, boatAngle);

	drawSprite("boat_house",boatX-14*boatCos,boatY-14*boatSin-8, boatAngle);
	drawSprite("boat_house",boatX-14*boatCos,boatY-14*boatSin-14, boatAngle);

	drawSprite("boat_antenna",boatX+10*boatCos,boatY+10*boatSin-10, 0);

	drawSprite("trans"+trans_frame,boatX+10*boatCos,boatY+10*boatSin-75, 0);

	drawUI();

	window.requestAnimationFrame(drawScene);
}

function drawUI()
{
	drawUISprite("engine_control",0,screenHeight / 2);
	var angle = boatSpeed * -0.56;
	drawUISprite("engine_lever",0,screenHeight / 2, angle);
}
