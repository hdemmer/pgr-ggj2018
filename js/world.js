
var cities = [];

var BASE_RADIUS = 100;
var boatPower = 1;
var boatConversion = 1;

function makeCity(x,y)
{
	return {x:x,y:y,complete:0};
}

function distanceToBoat(x,y)
{
	var dx = boatX - x;
	var dy = boatY - y;
	return Math.sqrt(dx*dx + dy*dy);
}

function signalStrengthAt(x,y)
{
	var d = distanceToBoat(x,y);
	var p = BASE_RADIUS * boatPower;
	if (d < p) return 1;
	if (d >= p * 2) return 0;
	var result =  1 - (d - p) / p;
	return result;
}

function initWorld()
{
	cities.push(makeCity(400,200));
}

function tickWorld()
{
	for (var i = cities.length - 1; i >= 0; i--) {
		var city = cities[i];

		var signal = signalStrengthAt(city.x,city.y);
		city.complete += signal * deltaTime * boatConversion;
	}
}