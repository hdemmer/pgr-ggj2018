

var ctx;
var sprites = {};

var screenWidth = 800;
var screenHeight = 600;
var scrollRubber = 0.2;
var uiRubber = 0.1;
var SPEED = 100;
var MIN_SPEED = -2;
var MAX_SPEED = 2;
var ACCELERATION = 0.005;

var boatTransmitting = false;
var boatAngle = 0;
var boatSpeed = 0;
var boatTargetSpeed = 0.0;
var boatX = 100;
var boatY = 100;
var isGameOver = false;
var NUM_GUYS = 8;
var collectedGuys = 0;

var scrollX = -0.5 * screenWidth + boatX;
var scrollY = -1 * (0.5-uiRubber) * screenHeight + boatY;

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

	initCollision();
	initWorld();

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
var prevTransmitKey = "";
var boatCos = 0;
var boatSin = 0;

function processInput()
{
	if (getKey("left")) boatAngle -= 0.01;
	if (getKey("right")) boatAngle += 0.01;
	if (getKey("up")) {
		if (prevKey != "up") boatTargetSpeed += 1;
		prevKey = "up";
	} else if (getKey("down")){
		if (prevKey != "down") boatTargetSpeed -= 1;
		prevKey = "down";
	} else {
		prevKey = "";
	}
	if (getKey("t"))
	{
		if (prevTransmitKey != "t") boatTransmitting = !boatTransmitting;
		prevTransmitKey = "t";
	} else {
		prevTransmitKey = "";
	}

	if (boatTargetSpeed > 2)
	{
		boatTargetSpeed = 2;
	}
	if (boatTargetSpeed < -2)
	{
		boatTargetSpeed = -2;
	}

	if (boatSpeed < boatTargetSpeed) {
		boatSpeed+=ACCELERATION;
	}
	if (boatSpeed > boatTargetSpeed) {
		boatSpeed-=ACCELERATION;
	}
	if (boatSpeed > MAX_SPEED) boatSpeed = MAX_SPEED;
	if (boatSpeed < MIN_SPEED) boatSpeed = MIN_SPEED;

	boatCos = Math.cos(boatAngle);
	boatSin = Math.sin(boatAngle);

	var nx = boatX + boatCos * boatSpeed * SPEED * deltaTime;
	var ny = boatY + boatSin * boatSpeed * SPEED * deltaTime;

	if (!isWater(nx,ny))
	{
		var nearest = nearestWaterTo(nx,ny,boatX,boatY);
		nx = nearest[0];
		ny = nearest[1];
	}
	if (isWater(nx,ny))
	{
		boatX = nx;
		boatY = ny;
	} else {
		boatSpeed = 0;
	}

	scrollX += (boatX - screenWidth * 0.5 - scrollX) * 0.5 * deltaTime;
	scrollY += (boatY - screenWidth * (0.4-uiRubber) - scrollY) * 0.5 * deltaTime;

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
	if (!isGameOver)
	{
		var t = new Date().getTime() / 1000;
		deltaTime = t - time;
		time = t;

		processInput();

		tickWorld();

		trans_frame = (Math.round(time * 1.9) % 4) + 1;
	}

	ctx.clearRect(0,0,screenWidth,screenHeight);
	//ctx.drawImage(sprites["map"],10,10); 
	drawSprite("map",2000,1500);

	drawEnemies();
	drawBoat();
	drawCities();
	drawUI();

	window.requestAnimationFrame(drawScene);
}

function drawBoat()
{
	drawSprite("boat_hull_lower",boatX,boatY, boatAngle);
	drawSprite("boat_hull",boatX,boatY-8, boatAngle);

	drawSprite("boat_house",boatX-14*boatCos,boatY-14*boatSin-8, boatAngle);
	drawSprite("boat_house",boatX-14*boatCos,boatY-14*boatSin-14, boatAngle);

	drawSprite("boat_antenna",boatX+10*boatCos,boatY+10*boatSin-10, 0);

	if (boatTransmitting)
	{
		drawSprite("trans"+trans_frame,boatX+10*boatCos,boatY+10*boatSin-75, 0);
	}

}

function drawCities()
{
	for (var i = cities.length - 1; i >= 0; i--) {
		var city = cities[i];

		var happiness = Math.floor(city.complete * 5);
		if (happiness < 0) happiness = 0;
		if (happiness > 5) happiness = 5;

		drawSprite("city_post"+city.post,city.x,city.y);
		drawSprite("city_pre"+city.pre,city.x,city.y);
		drawSprite("happiness"+happiness,city.x,city.y - 55);
	}
}

function drawEnemies()
{
	for (var i = enemies.length - 1; i >= 0; i--) {
		var enemy = enemies[i]
		var cos = Math.cos(enemy.angle);
		var sin = Math.sin(enemy.angle);

		drawSprite("enemy_lower",enemy.x,enemy.y, enemy.angle);
		drawSprite("enemy_upper",enemy.x,enemy.y - 10, enemy.angle);
		drawSprite("boat_house",enemy.x - 5 * cos,enemy.y - 5 * sin - 14, enemy.angle);
		if (enemy.attracted)
		{
			var s = Math.floor(time*4 + i*0.2 ) % 2;
			s+=1;
			drawSprite("enemy_siren"+s,enemy.x - 15 * cos,enemy.y - 15 * sin - 15);
		}
	}
}

function drawUI()
{
	var leftUIY = screenHeight / 2;
	drawUISprite("engine_control_shadow",0,leftUIY + 5);
	drawUISprite("engine_control",0,leftUIY);
	var angle = boatTargetSpeed * -0.56;
	drawUISprite("engine_lever_shadow",0,leftUIY + 8, angle);
	drawUISprite("engine_lever",0,leftUIY, angle);

	for (var i=0;i<collectedGuys;i++)
	{
		drawUISprite("portrait"+(i+1),50+100*i,screenHeight-75);
	}

	if (isGameOver)
	{
		if (collectedGuys >= NUM_GUYS)
		{
			// AW YEAH!
			//drawUISprite("busted",screenWidth /2,screenHeight /2, 0);
		} else{
			drawUISprite("busted",screenWidth /2,screenHeight /2, 0);
		}
		
	}
}
