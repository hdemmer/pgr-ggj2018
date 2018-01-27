
var terrainDataWidth = 0;
var terrainDataHeight = 0;
var terrainData;

function initCollision()
{
	var img = document.getElementById('terrain_map');
	var terrainCanvas = document.createElement('canvas');
	terrainCanvas.width = img.width;
	terrainCanvas.height = img.height;
	terrainDataWidth = img.width;
	terrainDataHeight = img.height;
	terrainCanvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
	terrainData = terrainCanvas.getContext('2d').getImageData(0,0, img.width, img.height).data;
}

function findCityLocations()
{
	var locations = [];
	for (var x=0;x<terrainDataWidth;x++)
	{
		for (var y=0;y<terrainDataHeight;y++)
		{
			if (terrainData[(x + terrainDataWidth*y) * 4 + 2] > 254)
			{
				locations.push([x,y]);
			}
		}
	}
	return locations;
}

function isWater(x,y)
{
	x/=10;
	y/=10;
	if (x < 0 || y < 0 || x >= terrainDataWidth || y >= terrainDataHeight) return false;

	var pixelData = terrainData[(Math.round(y) * terrainDataWidth + Math.round(x)) * 4 ];
	return pixelData > 0.5;
}

function nearestWaterTo(x,y,orgX,orgY)
{
	if (x < 0) return nearestWaterTo(0,y,orgX,orgY);
	if (y < 0) return nearestWaterTo(x,0,orgX,orgY);
	if (x > terrainDataWidth * 10 - 1) return nearestWaterTo((terrainDataWidth*10)-1,y,orgX,orgY);
	if (y > terrainDataHeight * 10 - 1) return nearestWaterTo(x,(terrainDataHeight*10)-1,orgX,orgY);

	var dx = x - orgX;
	var dy = y - orgY;

	for (var a = 10; a > 0; a--) {
		var t = a / 10;
		var it = 1-t;
		//if (it > 0.5) it = 1-it;

				var nx = x + dx * t;
				var ny = y + dy * t;
				if (isWater(nx,ny))
				{
					return [nx,ny];
				}
	}

	return [x,y];
}