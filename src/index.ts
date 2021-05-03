import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import './index.css'

const northWest = L.latLng(26, 117)
const southEast = L.latLng(21.5, 124)

const map = L.map(
  'map',
  {
    center: L.latLng(23.6, 120.965),
    zoom: 8,
    maxBounds: L.latLngBounds(northWest, southEast),
    minZoom: 8,
    preferCanvas: true
  }
)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)
