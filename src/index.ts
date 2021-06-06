import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import type GeoJSON from 'geojson'
import './index.css'
import { Elm } from './Main.elm'
import top100Json from './top100.json'

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2F0d2FyZSIsImEiOiJja3Awczk2MXkwM2QyMnVxdndnNTZ6c3oxIn0.VQu5bTCFO05pSuYJzakQWQ'
const map = new mapboxgl.Map({
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

const features : Array<GeoJSON.Feature> = top100Json.peaks[0].peaks.map(({ longitude, latitude, name } : Peak) =>
  ({
    type: 'Feature',
    properties: {
      description: name
    },
    geometry: {
      type: 'Point',
      coordinates: [longitude, latitude]
    }
  })
)

const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
})

const elmContainer = document.getElementById('elm-container')
if (elmContainer) {
  const app = Elm.Main.init({ node: elmContainer, flags: top100Json.peaks })
  app.ports.hoverOver.subscribe((peak : Peak) => {
    popup.setLngLat([peak.longitude, peak.latitude]).setHTML(peak.name).addTo(map)
  })
  app.ports.hoverOut.subscribe(() => popup.remove())

  const highlightClass = 'bg-blue-300'

  const setHighlight = (add : boolean) => (id : string) => {
    const listing = document.getElementById(id)
    if (listing) {
      if (add) {
        listing.classList.add(highlightClass)
      } else {
        listing.classList.remove(highlightClass)
      }
    }
  }

  const addHighlight = setHighlight(true)
  const removeHighlight = setHighlight(false)

  map.addControl(new mapboxgl.NavigationControl());
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

    map.on('mousemove', 'top100', (e) => {
      map.getCanvas().style.cursor = 'pointer'

      if (e.features && e.features[0]) {
        const feature = e.features[0]
        const coordinates = (<GeoJSON.Point>feature.geometry).coordinates.slice() as [number, number]
        const description = feature.properties?.description

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }

        const existingElement = popup.getElement()
        if (existingElement) {
          removeHighlight(existingElement.innerText)
        }
        popup.setLngLat(coordinates).setHTML(description).addTo(map)
        addHighlight(description)
        app.ports.mapPopupHover.send(description)
      }
    })

    map.on('mouseleave', 'top100', () => {
      map.getCanvas().style.cursor = ''
      removeHighlight(popup.getElement().innerText)
      popup.remove()
      app.ports.mapPopupHoverOut.send(null)
    })
  })



  const replaceClass = (arg : Element, from : string, to : string) => {
    if (arg instanceof HTMLElement) {
      arg.classList.remove(from)
      arg.classList.add(to)
    }
  }

  const headings = document.querySelectorAll('.js-listing')
  for (const tab of headings) {
    if (tab instanceof HTMLElement) {
      tab.onclick = () => {
        headings.forEach((oldTab) => replaceClass(oldTab, 'bg-blue-200', 'bg-gray-200'))
        replaceClass(tab, 'bg-gray-200', 'bg-blue-200')

        const listingData = tab.dataset.listing
        if (listingData) {
          // const listing = document.getElementById(`${listingData}-listing`)
          // if (listing) {
          // for (const peak of top100Json.peaks) {
          // const li = document.createElement('li')
          // li.classList.add(`hover:${highlightClass}`)
          // li.id = peak.name
          // li.append(peak.name)
          // li.onmouseover = () => popup.setLngLat([peak.longitude, peak.latitude]).setHTML(peak.name).addTo(map)
          // li.onmouseleave = () => popup.remove()
          // listing.append(li)
          // }
          // }
        }
      }
    }
  }
}
