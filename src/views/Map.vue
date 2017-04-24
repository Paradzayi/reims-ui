<template>
  <div class='ui stackable container grid'>
    <div class='two wide column'>
      <div class='ui vertical  red  pointing fluid  menu'>
        <div class='active item'>
          <a href='#'>Cities</a>
        </div>
        <div class='item'>
          <a href='#'>Cadastre</a>
        </div>
      </div>
    </div>

    <div class='twelve wide column'>
      <div class="ui fluid orange inverted segment">
        <div id='mapview' >

        </div>
      </div>

    </div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import axios from 'axios'
import config from '@/modules/config'
let ApiConfig = config.api

export default {
  data () {
    return {
      geojson: {}
    }
  },
  created () {
    axios.get(ApiConfig.baseUrl + '/api/cities')
      .then((response) => {
        console.log(response.data.data[0])
        this.geojson = response.data.data[0]
      })
      .catch((error) => {
        console.log(error)
      })
  },
  mounted () {
    this.fetchMapData()
  },

  methods: {

    initMap: function () {
      var _this = this
      // initialisation options for mapbox
      let mapOptions = {
        container: 'mapview', // container id
        style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
        center: [30.15, -18.13], // starting position
        zoom: 9, // starting zoom
        minZoom: 8,
        maxBounds: [[30.08, -18.18], [30.18, -18.10]]
      }

      // apply the accessToken and start the map
      mapboxgl.accessToken = 'pk.eyJ1IjoicmFpa28iLCJhIjoiSy1KVE82byJ9.dcia_8lqXX8DsL8czQNB9A'
      var map = new mapboxgl.Map(mapOptions)
      console.log('loading the map.............')

      map.on('load', function () {
        console.log('inside the load event...')
        // when the map loads add a new layer
        // map.on('load', () => {
        // add the city stands
        console.log(map)
        map.addSource('cities', {
          type: 'geojson',
          'data': _this.geojson
        })

        map.addLayer({
          'id': 'stands',
          'type': 'fill',
          'source': 'cities',
          'paint': {
            'fill-color': 'white',
            'fill-opacity': 0.7,
            'fill-outline-color': 'sienna'
          }
        })

        map.addControl(new mapboxgl.NavigationControl())
      })
    },

    fetchMapData () {
      console.log('fetching......')
      // fetch the geojson from server
      axios.get(ApiConfig.baseUrl + '/api/stands?map=true')
      .then(response => {
        this.geojson = response.data.data[0]

        // initialise the map.
        this.initMap()
      })
      .catch(err => {
        if (err) {
          console.log(err)
        }
      })
    }
  }
}
</script>

<style lang='css' scoped>
  #mapview {
    height: 500px;
    width: 100%;
  }
</style>
