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
  [120.9588000, 23.4466000, '玉山南峰'],
  [121.0575437, 23.4967827, '秀姑巒山'],
  [121.0672331, 23.5203357, '馬博拉斯山'],
  [121.4393689, 24.3618110, '南湖大山'],
  [120.9634024, 23.4390257, '東小南山'],
  [121.4162213, 24.3102143, '中央尖山'],
  [121.2404652, 24.4147359, '雪山北峰'],
  [120.9117115, 23.2280702, '關山'],
  [121.0384127, 23.4738428, '大水窟山'],
  [121.4508509, 24.3655967, '南湖大山東峰'],
  [121.0918738, 23.6268149, '東郡大山'],
  [121.3345488, 24.1183430, '奇萊北峰'],
  [120.9924466, 23.2843613, '向陽山'],
  [121.2004634, 24.3409492, '大劍山'],
  [120.9757537, 23.3537487, '雲峰'],
  [121.3232395, 24.0859950, '奇萊主山'],
  [121.1172129, 23.5215553, '馬利加南山'],
  [121.4371875, 24.3836773, '南湖北山'],
  [121.1211969, 24.3307510, '大雪山'],
  [121.2667684, 24.4282864, '品田山'],
  [120.9337289, 23.4718712, '玉山西峰'],
  [121.1407355, 24.3596007, '頭鷹山'],
  [121.0286090, 23.2971666, '三叉山'],
  [121.2579627, 24.4577542, '大霸尖山'],
  [121.4347568, 24.3477060, '南湖大山南峰'],
  [121.0815638, 23.6486537, '東巒大山'],
  [121.3846794, 24.2553239, '無明山'],
  [121.4378351, 24.3424151, '巴巴山'],
  [121.1739729, 23.4837438, '馬西山'],
  [121.2815976, 24.1815156, '北合歡山'],
  [121.2810876, 24.1356858, '合歡山東峰'],
  [121.2520994, 24.4556373, '小霸尖山'],
  [121.2711795, 24.1426410, '合歡山'],
  [120.9249002, 23.4292648, '南玉山'],
  [121.3471507, 24.2136036, '畢祿山'],
  [121.1158321, 23.8345614, '卓社大山'],
  [121.2798000, 24.0612167, '奇萊南峰'],
  [121.0105795, 23.3458858, '南雙頭山'],
  [121.2781593, 23.9655313, '能高山南峰'],
  [121.2511990, 24.3577147, '志佳陽大山'],
  [121.1089078, 24.2027126, '白姑大山'],
  [121.0096345, 23.4902117, '八通關山'],
  [121.1276177, 23.3165854, '新康山'],
  [121.2135381, 23.6004081, '丹大山'],
  [121.3049212, 24.4326327, '桃山'],
  [121.1880062, 24.3066338, '佳陽山'],
  [121.1750686, 24.3819312, '火石山'],
  [121.2881716, 24.4313152, '池有山'],
  [121.2436608, 24.4700063, '伊澤山'],
  [120.8741804, 23.0511607, '卑南主山'],
  [121.1389983, 23.8760274, '干卓萬山'],
  [121.4209829, 24.0790759, '太魯閣大山'],
  [120.9980804, 23.3913576, '轆轆山'],
  [121.1926092, 23.4632113, '喀西帕南山'],
  [121.1960500, 23.5792698, '內嶺爾山'],
  [121.3516603, 24.2443803, '鈴鳴山'],
  [120.9626034, 23.5773680, '郡大山'],
  [121.2602485, 23.9924783, '能高山'],
  [121.1855316, 23.8518647, '火山'],
  [121.1703154, 24.2954925, '劍山'],
  [121.3429479, 24.1492933, '屏風山'],
  [120.8761054, 23.1516376, '小關山'],
  [121.1532699, 23.5864600, '義西請馬至山'],
  [121.1602347, 23.8628877, '牧山'],
  [120.9176500, 23.4756000, '玉山前峰'],
  [121.2845890, 24.1523855, '石門山'],
  [121.0573083, 23.5909368, '無雙山'],
  [120.9412369, 23.2519162, '塔關山'],
  [121.4856510, 24.3483309, '馬比杉山'],
  [121.0132027, 23.4327284, '達芬尖山'],
  [121.2720305, 24.3887653, '雪山東峰'],
  [121.2859219, 24.0393830, '南華山'],
  [120.9594446, 23.2710059, '關山嶺山'],
  [120.9113156, 23.1855833, '海諾南山'],
  [121.0780097, 24.3364724, '中雪山'],
  [121.3099247, 24.2587295, '閂山'],
  [121.3898330, 24.2903940, '甘薯峰'],
  [121.2445342, 24.1776587, '西合歡山'],
  [121.4174621, 24.3802144, '審馬陣山'],
  [121.3212902, 24.4500222, '喀拉業山'],
  [120.9000183, 23.2628023, '庫哈諾辛山'],
  [121.2162189, 24.4595175, '加利山'],
  [121.2747975, 23.9075330, '白石山'],
  [121.3883058, 24.1047263, '磐石山'],
  [121.4666076, 24.0994429, '帕托魯山'],
  [120.7613767, 22.6270765, '北大武山'],
  [120.9473179, 23.6940034, '西巒大山'],
  [121.0267840, 23.4060261, '塔芬山'],
  [121.4457109, 24.1249150, '立霧主山'],
  [121.2661296, 23.8727015, '安東軍山'],
  [121.2719594, 23.9380107, '光頭山'],
  [121.3797945, 24.2082521, '羊頭山'],
  [121.0787129, 23.2331222, '布拉克桑山'],
  [121.0325002, 23.5483852, '駒盆山'],
  [121.2395059, 23.7245102, '六順山'],
  [120.9886093, 23.4506319, '鹿山'],
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

const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
})

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
    }
  })

  map.on('mouseleave', 'top100', () => {
    map.getCanvas().style.cursor = ''
    removeHighlight(popup.getElement().innerText)
    popup.remove()
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
        const listing = document.getElementById(`${listingData}-listing`)
        if (listing) {
          for (const feature of featuresRaw) {
            const li = document.createElement('li')
            li.classList.add(`hover:${highlightClass}`)
            li.id = feature[2]
            li.append(feature[2])
            li.onmouseover = () => popup.setLngLat([feature[0], feature[1]]).setHTML(feature[2]).addTo(map)
            li.onmouseleave = () => popup.remove()
            listing.append(li)
          }
        }
      }
    }
  }
}
