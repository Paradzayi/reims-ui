<template>
  <div class='ui stackable container grid'>
    <!-- The menu and any stuff on the left hand side -->
    <div class='five wide column'>

      <!-- Label showing users where to click-->
      <div class="ui fluid centered orange pointing below basic label">
        <p>Select any thing you want to see on the map</p>
      </div>

      <!-- The menu-->
      <div class='ui vertical  orange fluid  menu'>

        <!-- The reservedStads menu item-->
        <div
          :class="{active: geojson.reservedStands.features, item: true, link: true}">

          <!-- Fetch reserved items when you click here -->
          <a
            @click="fetchReservedStands">
            Reserved Stands
          </a>

          <!-- show the user the number of reserved items -->
          <div
            class="ui orange basic label"
            v-if = "geojson.reservedStands.features">
            {{ geojson.reservedStands.features.length }}
          </div>

          <!-- Allow the user to toggle the layers if they are present -->
          <div
            v-if = "geojson.reservedStands.features">
            <p>
              <div class="ui toggle checkbox">
                <input
                  type="checkbox"
                  :checked="isLayerInMap('reservedStands')"
                  @click="toggleLayer('reservedStands')">
                <label>Show in map</label>
              </div>
            </p>
          </div>

        </div><!--/ The reservedStands menu item -->

        <!-- Other menu items will come down here -->
        <a class="item" @click="fetchReservedStands">Reserved Stands</a>
      </div>
    </div>

    <!-- The map stuff here -->
    <div class='eleven wide column'>

      <div class="ui fluid orange segment">
        <!-- The map will be auto injected-->
        <div id='mapview' ></div>
      </div>

    </div><!--/ The map stuff here -->
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import axios from 'axios'
import config from '@/modules/config'
import polylabel from 'polylabel'
let ApiConfig = config.api

export default {
  /*
    The warehouse of this component.
    Store anything that is required by more than
    one function.
  */
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
      map: {},

      // The popup object
      popup: new mapboxgl.Popup({
        closeButton: false
      }),

      // Define the queryable layers
      layers: [],

      // Define the style of the layers so that
      // they can be used to recreate the layer during toggling
      layerStyles: []
    }
  },

  /*
    Code that is executed when the component has been compiled
    and ready to be used.
  */
  mounted () {
    // Initilise the map and fetch the cadastre and stands (static parts of the map)
    this.initMap()
    this.fetchBaseItems()
  },

  /*
    The methods used to manipulate the state of the components
    and fetch data, ect
  */
  methods: {

    /*
      Make a new map and attach map event
    */
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

    /*
      make the map responsive to movements of the mouse.
    */
    addMouseMoveEvent () {
      // Listen to the mousemove event
      this.map.on('mousemove', e => {
        // Loop through all the registered (ones available for popup info)
        this.layers.forEach(layer => {
          // Deregister the layer if it does not exist on the map
          if (!this.map.getLayer(layer)) {
            this.layers.splice(this.layers.indexOf(layer), 1)
          }
        })

        // Query the features on the map
        let features = this.map.queryRenderedFeatures(e.point, {
          layers: this.layers
        })

        // Change the cursor style as a UI indicator.
        this.map.getCanvas().style.cursor = features ? 'pointer' : ''

        // Remove the popup if the point on the map does not have any features
        if (!features) {
          this.popup.remove()
          return
        }

        // The feature on top of the stack i.e the one pointed by the mouse.
        let feature = features[0]

        // If there are features where the mouse is pointing show the popup
        if (feature) {
          // Align the popup to the point where the mouse is pointing
          this.popup.setLngLat(polylabel(feature.geometry.coordinates))

          // Place some data in the popup and add it to the map
          this.popup.setHTML(`<p style="color:purple">hello world</p>`)
            .addTo(this.map)
        }
      })
    },

    /*
      when the map loads add cities and cadastre sources
      and create the static layers for them
    */
    addLoadEvent () {
      // fix for calling this component inside functions where this will be undifined
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

        this.map.addSource('cadastre', {
          type: 'geojson',
          'data': _this.geojson.cadastre
        })

        // Add stands layer
        this.map.addLayer({
          'id': 'cadsatre',
          'type': 'fill',
          'source': 'cadastre',
          'paint': {
            'fill-color': 'pink',
            'fill-opacity': 0.2,
            'fill-outline-color': 'red'
          }
        })
        // Add the Naviagtion control that allows one to pan and zoom the map
        this.map.addControl(new mapboxgl.NavigationControl())
      })
    },

    /*
      fetch data for the stands and store it in the data() function
    */
    fetchStandsData () {
      // fix for calling this component inside functions where this will be undifined
      var _this = this

      // fetch the geojson from server
      axios.get(ApiConfig.baseUrl + '/api/stands?map=true')
        .then(response => {
          // Store the response for later use
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

    /*
      fetch the data fro the cities and cadastre and Store
      it in the data() function
    */
    fetchBaseItems () {
      // fix for calling this component inside functions where this will be undifined
      var _this = this

      function getCitiesData () {
        return axios.get(ApiConfig.baseUrl + '/api/cities')
      }

      function getCadatreData () {
        return axios.get(ApiConfig.baseUrl + '/api/cadastre')
      }

      axios.all([getCitiesData(), getCadatreData()])
        .then(axios.spread(function (cities, cadastre) {
          // Both requests are now complete
          _this.geojson.cadastre = cadastre.data.data[0]
          _this.geojson.cities = cities.data.data[0]
        }))
        .catch(err => {
          if (err) {
            console.log(err)
          }
        })
    },

    /*
      fetch the reservedStands and store them locally in the data() function
    */
    fetchReservedStands () {
      // fix for calling this component inside functions where this will be undifined
      var _this = this

      // fetch the geojson from server
      axios.get(ApiConfig.baseUrl + '/api/stands/reservations?map=true')
        .then(response => {
        // Found the data! save it locally
          this.geojson.reservedStands = response.data.reservedstandsmap[0]

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

          // Define the reservedStandsStyle
          let reservedStandsStyle = {
            'id': 'reservedStands',
            'type': 'fill',
            'source': 'stands',
            'paint': {
              'fill-color': 'white',
              'fill-opacity': 0.7,
              'fill-outline-color': 'sienna'
            }
          }

          // Add stands layer
          this.map.addLayer(reservedStandsStyle)

          // Then register the layer with the component's data
          this.layers.push('reservedStands')

          // Then register the style  with the component's data
          this.layerStyles.push(reservedStandsStyle)
        })
      .catch(err => {
        if (err) {
          console.log(err)
        }
      })
    },

    /*
      add or remove layers. Says no to frequent server requests
    */
    toggleLayer (value) {
      if (this.map.getLayer(value)) {
        // Remove the layer from the map
        this.map.removeLayer(value)

        // Register the layer
        this.layers.splice(this.layers.indexOf('reservedStands'), 1)
      } else {
        // Code to add the layer again
        let layer = this.layerStyles.find(layer => {
          return layer.id === value
        })

        // Only add the layer if it is found
        if (layer) {
          this.map.addLayer(layer)

          // Then register the layer with the component's data
          this.layers.push('reservedStands')
        }
      }
    },

    /*
      check if the layer is in the map and return true else return false
    */
    isLayerInMap (value) {
      // Return true if the layer is defined in the map
      return this.map.getLayer(value) !== undefined
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
