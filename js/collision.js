
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

function isWater(x,y)
{
	if (x < 0 || y < 0 || x >= terrainDataWidth || y >= terrainDataHeight) return false;

	var pixelData = terrainData[(Math.round(y) * terrainDataWidth + Math.round(x)) * 4 ];
	return pixelData < 0.5;
}

function nearestWaterTo(x,y)
{
	if (x < 0) return nearestWaterTo(0,y);
	if (y < 0) return nearestWaterTo(x,0);
	if (x >= terrainDataWidth) return nearestWaterTo(terrainDataWidth-1,y);
	if (y >= terrainDataHeight) return nearestWaterTo(x,terrainDataHeight-1);

	for (var a = 0; a < 6; a++) {
			for (var r = 1; r < 10; r+=3) {
				var nx = x + Math.cos(a)  * r;
				var ny = y + Math.sin(a) * r;
				if (isWater(nx,ny))
				{
					return [nx,ny];
				}
		}
	}

	return [x,y];
}