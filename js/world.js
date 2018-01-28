
var cities = [];
var enemies = [];
var waves = [];

var ENEMY_SPEED = 20;
var BASE_RADIUS = 100;
var BUSTED_DISTANCE = 40;
var SCALE = 10;
var boatPower = 1;
var boatConversion = 0.1;

function spawnWave(x,y)
{
	waves.push({x:x,y:y,spawnTime:time});
}

function spawnEnemy(x,y)
{
	enemies.push({x:x,y:y,attracted:false,angle:0,spawnTime:time});
}

function spawnCity(x,y)
{
	var pre = Math.floor(Math.random() * 5.9);
	var post = Math.floor(Math.random() * 5.9);
	cities.push({x:x,y:y,complete:0.5,
		pre:pre,post:post,evil:false,hasGuy:false,
		receiving:false});
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
	var locs = findCityLocations();
	for (var i = locs.length - 1; i >= 0; i--) {
		var loc = locs[i];
		var invalid = false;
		for (var j=0;j<i;j++)
		{
			var prLoc = locs[j];
			var dx = loc[0] - prLoc[0];
			var dy = loc[1] - prLoc[1];
			var d = dx*dx + dy*dy;
			if (d < 25) {
				invalid = true;
				break;
			}
		}
		if (!invalid)
		{
			spawnCity(loc[0]*SCALE,loc[1]*SCALE);
		}
	}

	
	spawnEnemy(400,300);
	spawnWave(550,550);

	var guyCount = 0;

	for (var i = cities.length - 1; i >= 0; i--) {
		var city = cities[i];
		city.hasGuy = (Math.random() < 0.7?true:false);
		city.evil = Math.random() < 0.7;

		if (!city.evil && city.hasGuy)
		{
			guyCount ++;
		}
	}

	while (guyCount < NUM_GUYS)
	{
		var i = Math.floor(Math.random() * (cities.length -1));
		var city = cities[i];
		if (city.evil || !city.hasGuy)
		{
			city.evil = false;
			city.hasGuy = true;
			guyCount ++;
		}
	}
}

function trySpawnEnemy(city)
{
	var RAD = 25;
	var bx = (boatX + city.x) / 2;
	var by = (boatY + city.y) / 2;
	for (var i = 0; i < 10 ;i++)
	{
		var x = bx + (Math.random() -0.5) * RAD;
		var y = by + (Math.random() -0.5) * RAD;
		if (isWater(x,y))
		{
			spawnEnemy(x,y);
			return;
		}
	}
	
}

function tickWorld()
{
		for (var i = cities.length - 1; i >= 0; i--) {
			var city = cities[i];

			var signal = signalStrengthAt(city.x,city.y);
			city.receiving = signal > 0.1;
			var sign = 1;
			if (city.evil) {sign = -1;}
			city.complete += sign * signal * deltaTime * boatConversion;
			if (city.complete < 0)
			{
				if (city.hasGuy)
				{
					city.hasGuy = false;
					trySpawnEnemy(city);
				}
				city.complete = 0;
			}
			if (city.complete > 1)
			{
				city.complete = 1;
				if (city.hasGuy)
				{
					city.hasGuy = false;
					collectedGuys ++;
					if (collectedGuys >= NUM_GUYS)
					{
						isGameOver = true;
					}
				}
			}
	}

	for (var i = enemies.length - 1; i >= 0; i--) {
		var enemy = enemies[i];
		if ((time - enemy.spawnTime) < 2)
		{
			continue;
		}
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