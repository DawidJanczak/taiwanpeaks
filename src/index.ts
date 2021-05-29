import 'leaflet/dist/leaflet.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import type GeoJSON from 'geojson'
import './index.css'

// const northWest = L.latLng(26, 117)
// const southEast = L.latLng(21.5, 124)

// const map = L.map(
  // 'map',
  // {
    // center: L.latLng(23.6, 120.965),
    // zoom: 8,
    // maxBounds: L.latLngBounds(northWest, southEast),
    // minZoom: 8,
    // preferCanvas: true
  // }
// )
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map)

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2F0d2FyZSIsImEiOiJja3Awczk2MXkwM2QyMnVxdndnNTZ6c3oxIn0.VQu5bTCFO05pSuYJzakQWQ'
const map = new mapboxgl.Map({
  bounds: [[121, 21.7], [120, 25.5]],
  center: [120.5, 23.6],
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v11'
})

const featuresRaw : Array<[number, number, string]> = [
  [120.9572707, 23.4700025, '玉山'],
  [121.2317647, 24.3834112, '雪山主峰'],
  [120.9651888, 23.4707259, '玉山東峰'],
  [120.9594719, 23.4875306, '玉山北峰'],
  [120.9337289, 23.4718712, '玉山西峰'],
  [120.9176500, 23.4756000, '玉山前峰'],
  [120.9886093, 23.4506319, '鹿山'],
  [120.9634024, 23.4390257, '東小南山'],
  [120.9588000, 23.4466000, '玉山南峰'],
  [120.9249002, 23.4292648, '南玉山'],
]
const features : Array<GeoJSON.Feature> = featuresRaw.map(([lon, lat, desc]) =>
  ({
    type: 'Feature',
    properties: {
      description: desc
    },
    geometry: {
      type: 'Point',
      coordinates: [lon, lat]
    }
  })
)

map.on('load', () => {
  map.addSource('top100', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: features
    }
  })
  map.addLayer({
    id: 'top100',
    type: 'circle',
    source: 'top100',
    paint: {
      'circle-color': '#4264fb',
      'circle-radius': 6,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  })

  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  })

  map.on('mousemove', 'top100', (e) => {
    map.getCanvas().style.cursor = 'pointer';

    if (e.features && e.features[0]) {
      const feature = e.features[0];
      const coordinates = (<GeoJSON.Point>feature.geometry).coordinates.slice() as [number, number];
      const description = feature.properties?.description;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      popup.setLngLat(coordinates).setHTML(description).addTo(map);
    }
  })

  map.on('mouseleave', 'top100', () => {
    map.getCanvas().style.cursor = '';
    popup.remove();
  })
})

const listing = document.getElementById('top100-listing')
if (listing) {
  for (const feature of featuresRaw) {
    const li = document.createElement('li')
    li.append(feature[2])
    listing.append(li)
  }
}
