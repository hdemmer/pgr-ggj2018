
var cities = [];
var enemies = [];

var ENEMY_SPEED = 20;
var BASE_RADIUS = 100;
var BUSTED_DISTANCE = 40;
var boatPower = 1;
var boatConversion = 1;

function spawnEnemy(x,y)
{
	enemies.push({x:x,y:y,attracted:false,angle:0});
}

function spawnCity(x,y)
{
	var pre = Math.floor(Math.random() * 5.9);
	var post = Math.floor(Math.random() * 5.9);
	cities.push({x:x,y:y,complete:0, pre:pre,post:post});
}

function distanceToBoat(x,y)
{
	var dx = boatX - x;
	var dy = boatY - y;
	return Math.sqrt(dx*dx + dy*dy);
}

function signalStrengthAt(x,y)
{
	if (!boatTransmitting) return 0;

	var d = distanceToBoat(x,y);
	var p = BASE_RADIUS * boatPower;
	if (d < p) return 1;
	if (d >= p * 2) return 0;
	var result =  1 - (d - p) / p;
	return result;
}

function initWorld()
{
	spawnCity(400,200);
	spawnEnemy(400,100);
}

function tickWorld()
{
	if (boatTransmitting)
	{
		for (var i = cities.length - 1; i >= 0; i--) {
			var city = cities[i];

			var signal = signalStrengthAt(city.x,city.y);
			city.complete += signal * deltaTime * boatConversion;
		}
	}

	for (var i = enemies.length - 1; i >= 0; i--) {
		var enemy = enemies[i];
		if (enemy.attracted)
		{
			var d = distanceToBoat(enemy.x,enemy.y);
			if (d < BUSTED_DISTANCE)
			{
				isGameOver = true;
				return;
			}
			var dx = (boatX - enemy.x) / d;
			var dy = (boatY - enemy.y) / d;

			var tx = enemy.x + ENEMY_SPEED * deltaTime * dx;
			var ty = enemy.y + ENEMY_SPEED * deltaTime * dy;

			if (isWater(tx,ty))
			{
				enemy.x = tx;
				enemy.y = ty;
				enemy.angle = Math.atan2(dy,dx);
			}
		} else {
			var signal = signalStrengthAt(enemy.x,enemy.y);
			if (signal > 0)
			{
				enemy.attracted = true;
			}

		}
	}
}