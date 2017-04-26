<template>
  <div class='ui stackable container grid'>
    <div class='four wide column'>
      <div class='ui vertical  red  pointing fluid  menu'>
        <div class='active item'>
          <a href='#'>Cities</a>
        </div>
        <div class='item'>
          <a href='#'>Cadastre</a>
        </div>
        <a class="item" @click="fetchReservedStands">Reserved Stands</a>
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
import polylabel from 'polylabel'
let ApiConfig = config.api

export default {
  data () {
    return {

      // The geogarphies that will be laid onto the map
      geojson: {
        cities: {},
        cadastre: {},
        stands: {},
        reservedStands: {}
      },

      // initialisation options for mapbox
      mapOptions: {
        container: 'mapview', // container id
        style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
        center: [30.15, -18.13], // starting position
        zoom: 9, // starting zoom
        minZoom: 8
      },

      // The map object
      map: {}
    }
  },

  created () {
    axios.get(ApiConfig.baseUrl + '/api/cities')
      .then((response) => {
        console.log(response.data.data[0])
        this.geojson.cities = response.data.data[0]
      })
      .catch((error) => {
        console.log(error)
      })
  },

  mounted () {
    this.initMap()
  },

  methods: {

    initMap: function () {
      // apply the accessToken and start the map
      mapboxgl.accessToken = 'pk.eyJ1IjoicmFpa28iLCJhIjoiSy1KVE82byJ9.dcia_8lqXX8DsL8czQNB9A'

      // Create a new map with the specified options
      this.map = new mapboxgl.Map(this.mapOptions)

      // Listen to the load event and add the sources and layers
      this.addLoadEvent()

      // Listen to the mouse movements and act accordigly
      this.addMouseMoveEvent()
    },

    addMouseMoveEvent () {
      // Define popup here
      let popup = new mapboxgl.Popup({
        closeButton: false
      })

      // Listen to the mousemove event
      this.map.on('mousemove', e => {
        // Query the features on the map
        let features = this.map.queryRenderedFeatures(e.point, {
          layers: ['stands']
        })

        // Change the cursor style as a UI indicator.
        this.map.getCanvas().style.cursor = features.length ? 'pointer' : ''

        // Remove the popup if the point on the map does not have any features
        if (!features.length) {
          popup.remove()
          return
        }

        // The feature on top of the stack i.e the one pointed by the mouse.
        let feature = features[0]

        // Align the popup to the point where the mouse is pointing
        popup.setLngLat(polylabel(feature.geometry.coordinates))

        // Place some data in the popup and add it to the map
        popup.setHTML(`<p style="color:purple">hello world</p>`)
          .addTo(this.map)
      })
    },

    addLoadEvent () {
      var _this = this

      // Listen to the load event
      this.map.on('load', () => {
        // Add cities source
        this.map.addSource('cities', {
          type: 'geojson',
          'data': _this.geojson.cities
        })

        // Add stands layer
        this.map.addLayer({
          'id': 'cities',
          'type': 'fill',
          'source': 'cities',
          'paint': {
            'fill-opacity': 0.2,
            'fill-outline-color': 'red'
          }
        })

        // Add the Naviagtion control that allows one to pan and zoom the map
        this.map.addControl(new mapboxgl.NavigationControl())
      })
    },

    fetchStandsData () {
      var _this = this
      // fetch the geojson from server
      axios.get(ApiConfig.baseUrl + '/api/stands?map=true')
        .then(response => {
          this.geojson.stands = response.data.data[0]

          // only add the source if the source has not been added before
          if (!this.map.getSource('stands')) {
            // add source
            this.map.addSource('stands', {
              type: 'geojson',
              'data': _this.geojson.stands
            })
          }

          // Destroy any layer for stands and add a new one
          if (this.map.getLayer('stands')) {
            this.map.removeLayer('stands')
          }
          // Add stands layer
          this.map.addLayer({
            'id': 'stands',
            'type': 'fill',
            'source': 'stands',
            'paint': {
              'fill-color': 'white',
              'fill-opacity': 0.7,
              'fill-outline-color': 'sienna'
            }
          })
        })
        .catch(err => {
          if (err) {
            console.log(err)
          }
        })
    },

    fetchReservedStands () {
      console.log('fetching reserved stands')
      // fetch the geojson from server
      axios.get(ApiConfig.baseUrl + '/api/stands/reservations?map=true')
        .then(response => {
        // Found the data! save it locally
          this.geojson.reservedStands = response.data.reservedstandsmap[0]

          var _this = this

          // only add the source if the source has not been added before
          if (!this.map.getSource('stands')) {
            // add source
            this.map.addSource('stands', {
              type: 'geojson',
              'data': _this.geojson.reservedStands
            })
          }

          // Destroy any layer for reserved stands and add a new one
          if (this.map.getLayer('reservedStands')) {
            this.map.removeLayer('reservedStands')
          }

          // Add stands layer
          this.map.addLayer({
            'id': 'reservedStands',
            'type': 'fill',
            'source': 'stands',
            'paint': {
              'fill-color': 'white',
              'fill-opacity': 0.7,
              'fill-outline-color': 'sienna'
            }
          })
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
