

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
var boatX = 600;
var boatY = 600;
var isGameOver = false;
var NUM_GUYS = 4;
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
	initTracks(["track-0.wav","track-1.wav", "track-2.wav"]);
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
var prevMuteKey = "m"
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
		if (prevTransmitKey != "t") { 
			boatTransmitting = !boatTransmitting;
			if(boatTransmitting) {
				if (collectedGuys == 0) {
					transmitNoGuysMusic()
				}
				else {
					toggleAllGuys(collectedGuys, true)
				}
			}
			else {
				if (collectedGuys == 0) {
					stopTransmitNoGuysMusic()
				}
				else {
					toggleAllGuys(collectedGuys, false)
				}
			}
		}
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
	drawWaves();
	drawBoatWake();
	drawCities();
	drawEnemies();
	drawBoat();
	
	drawUI();

	window.requestAnimationFrame(drawScene);
}

var waveAngle = 0;
function drawBoatWake()
{
	waveAngle = ((1-deltaTime)*waveAngle + deltaTime * boatAngle);
	var waveFrame = Math.floor(time*3) % 2 + 1;
	if (boatSpeed > 1)
	{
		drawSprite("wave"+waveFrame,boatX - 70 * boatCos,boatY - 70 * boatSin, waveAngle);
	}
}
function drawBoat()
{
	var sway = 3*Math.sin(time);

	drawSprite("boat_hull_lower",boatX,boatY + sway, boatAngle);
	drawSprite("boat_hull",boatX,boatY-8 + sway, boatAngle);

	drawSprite("boat_house",boatX-14*boatCos,boatY-14*boatSin-8 + sway, boatAngle);
	drawSprite("boat_house",boatX-14*boatCos,boatY-14*boatSin-14 + sway, boatAngle);

	drawSprite("boat_antenna",boatX+10*boatCos,boatY+10*boatSin-10 + sway, 0);

	if (boatTransmitting)
	{
		drawSprite("trans"+trans_frame,boatX+10*boatCos,boatY+10*boatSin-75 + sway, 0);
	}

}

function drawWaves()
{
	for (var i = waves.length - 1; i >= 0; i--) {
		var wave = waves[i];
		var t = (time - wave.spawnTime) % 5;
		var frame = Math.floor(t);
		if (frame > 0 && frame < 3)
		{
			//drawSprite("wave"+frame,wave.x,wave.y - t* 12);
		}
	}
}

function drawCities()
{
	for (var i = cities.length - 1; i >= 0; i--) {
		var city = cities[i];

		var happiness = 2;

		if (city.complete <= 0) happiness = 0;
		else if (city.complete >= 1) happiness = 5;
		else if (city.receiving) happiness = "o";

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

	if (boatTransmitting)
	{
		drawUISprite("ui_music_on",40,35);
	} else {
		drawUISprite("ui_music_off",40,35);
	}
	drawUISprite("ui_rudder",60,525);

	drawUISprite("key_t",95,35);
	drawUISprite("key_w",35,140);
	drawUISprite("key_s",35,450);
	drawUISprite("key_a",30,570);
	drawUISprite("key_d",90,570);

	if (getKey("up")) drawUISprite("key_lit_w",35,140);
	if (getKey("down")) drawUISprite("key_lit_s",35,450);
	if (getKey("t")) drawUISprite("key_lit_t",95,35);
	if (getKey("left")) drawUISprite("key_lit_a",30,570);
	if (getKey("right")) drawUISprite("key_lit_d",90,570);

	var absTime = (new Date().getTime() / 1000);
	
	if (isGameOver)
	{
		var frame = Math.floor(absTime*1.5 % 2) + 1;
		if (collectedGuys >= NUM_GUYS)
		{
			drawUISprite("ui_partytime"+frame,screenWidth /2,screenHeight /2 -50, 0);
		} else{
			drawUISprite("busted",screenWidth /2,screenHeight /2, (frame - 1.1) * -0.3);
		}

		drawUISprite("ui_restart",screenWidth - 100,screenHeight -80, (frame - 1.1) *0.3);
	}

	for (var i=0;i<collectedGuys;i++)
	{
		var off = Math.abs(Math.cos(absTime * (i+3)));
		off *= 15;
		drawUISprite("portrait"+(i+1),250+120*i,screenHeight-75-off);
	}

}
