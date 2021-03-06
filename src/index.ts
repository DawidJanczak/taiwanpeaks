import type GeoJSON from 'geojson'
import './index.css'
import { Elm } from './Main.elm'
import top100Json from './top100'

window.mapboxgl.accessToken = 'pk.eyJ1IjoiZ2F0d2FyZSIsImEiOiJja3Awczk2MXkwM2QyMnVxdndnNTZ6c3oxIn0.VQu5bTCFO05pSuYJzakQWQ'

const map = new window.mapboxgl.Map({
  bounds: [[121, 21.7], [120, 25.5]],
  center: [120.5, 23.6],
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v11'
})

interface Peak {
  latitude : number
  longitude : number
  name : string
}

const peaks : Array<Peak> = top100Json.peaks[0].peaks
const features : Array<GeoJSON.Feature> = peaks.map(({ longitude, latitude, name } : Peak) =>
  ({
    type: 'Feature',
    properties: {
      name: name
    },
    geometry: {
      type: 'Point',
      coordinates: [longitude, latitude]
    }
  })
)

const popup = new window.mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
})

const elmContainer = document.getElementById('elm-container')
if (elmContainer) {
  const app = Elm.Main.init({ node: elmContainer, flags: [top100Json.peaks[0]] })
  app.ports.peakSelected.subscribe((peak : Peak) => {
    if (map.getZoom() >= 8) {
      map.flyTo({
        center: [peak.longitude, peak.latitude],
        speed: 0.5
      })
    }
    popup.setLngLat([peak.longitude, peak.latitude]).setHTML(peak.name).addTo(map)
  })

  map.addControl(new window.mapboxgl.NavigationControl());
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
      // Switch to symbol for text
      // type: 'symbol',
      type: 'circle',
      source: 'top100',
      paint: {
        'circle-color': '#4264fb',
        'circle-radius': 6,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      },
      // Disable for symbols
      // layout: {
        // 'icon-image': 'marker-15',
        // 'text-field': '{description}',
        // 'text-anchor': 'top',
        // 'text-size': {
            // "stops": [
                // [0, 0],
                // [5, 0],
                // [6, 13]
            // ]
        // }
      // }
    })

    map.on('mousemove', 'top100', (e) => {
      map.getCanvas().style.cursor = 'pointer'

      if (e.features && e.features[0]) {
        const feature = e.features[0]
        const coordinates = (<GeoJSON.Point>feature.geometry).coordinates.slice() as [number, number]
        const name = feature.properties?.name

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }

        popup.setLngLat(coordinates).setHTML(name).addTo(map)
      }
    })

    map.on('mouseleave', 'top100', () => {
      map.getCanvas().style.cursor = ''
      popup.remove()
    })

    map.on('click', 'top100', (e) => {
      if (e.features && e.features[0]) {
        const feature = e.features[0]
        const name = feature.properties?.name
        const peak = document.getElementById(name)
        if (peak) {
          peak.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        app.ports.peakSelectedOnMap.send(name)
      }
    })
  })
}
