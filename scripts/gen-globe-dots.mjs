// Samples an equal-area-ish grid over land polygons -> compact dot list for the globe.
// Output: JSON array of [lat*10, lon*10] integers.
import { readFileSync, writeFileSync } from 'node:fs';

const geo = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const out = process.argv[3];

// Collect all rings (outer + holes; even-odd ray casting handles both)
const polys = []; // each: { rings: [[[x,y],...]], bbox: [minX,minY,maxX,maxY] }
const geoms =
  geo.type === 'GeometryCollection'
    ? geo.geometries
    : (geo.features || []).map(f => f.geometry);
for (const g of geoms) {
  if (!g) continue;
  const groups = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
  for (const rings of groups) {
    let minX = 180, minY = 90, maxX = -180, maxY = -90;
    for (const ring of rings) {
      for (const [x, y] of ring) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    polys.push({ rings, bbox: [minX, minY, maxX, maxY] });
  }
}

function inPoly(lon, lat, poly) {
  const [minX, minY, maxX, maxY] = poly.bbox;
  if (lon < minX || lon > maxX || lat < minY || lat > maxY) return false;
  let inside = false;
  for (const ring of poly.rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i];
      const [xj, yj] = ring[j];
      if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }
    }
  }
  return inside;
}

const isLand = (lon, lat) => polys.some(p => inPoly(lon, lat, p));

const dots = [];
const LAT_STEP = 1.15;
for (let lat = -56; lat <= 72; lat += LAT_STEP) {
  const lonStep = LAT_STEP / Math.max(0.25, Math.cos((lat * Math.PI) / 180));
  for (let lon = -180; lon < 180; lon += lonStep) {
    if (isLand(lon, lat)) dots.push([Math.round(lat * 10), Math.round(lon * 10)]);
  }
}

writeFileSync(out, JSON.stringify(dots));
console.log(`dots: ${dots.length}, bytes: ${JSON.stringify(dots).length}`);
