import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import './index.css'

const map = L.map('map').setView([51.505, -0.09], 13)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)
console.log('foo')
