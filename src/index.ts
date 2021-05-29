import 'leaflet/dist/leaflet.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import L from 'leaflet'
import mapboxgl from 'mapbox-gl'
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
  bounds: [[124, 21.5], [117, 26]],
  center: [120.965, 23.6],
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v11'
})
