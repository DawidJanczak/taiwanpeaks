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

map.on('load', () => {
  map.addSource('top100', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            description: 'Yushan'
          },
          geometry: {
            type: 'Point',
            coordinates: [120.957, 23.47]
          }
        }
      ]
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

  map.on('mouseenter', 'top100', (e) => {
    map.getCanvas().style.cursor = 'pointer';

    if (e.features && e.features[0]) {
      const feature = e.features[0];
      const coordinates = (<GeoJSON.Point>feature.geometry).coordinates.slice() as mapboxgl.LngLatLike;
      const description = feature.properties?.description;

      popup.setLngLat(coordinates).setHTML(description).addTo(map);
    }
  })

  map.on('mouseleave', 'top100', () => {
    map.getCanvas().style.cursor = '';
    popup.remove();
  })
})
