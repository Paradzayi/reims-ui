<template>
  <div class='ui stackable container grid'>
    <!-- The menu and any stuff on the left hand side -->
    <div class='five wide column'>

      <!-- Show loading when the loading variable is true -->
      <div class="ui orange fluid segment" v-if="loading === true">
          <div class="ui mini loading basic segment"> </div>
      </div>

      <buy-summary
        v-if="openBuySummary === true"
        @close="openBuySummary = false">
      </buy-summary>
      <!-- The menu-->
      <div class='ui vertical  orange fluid mini menu'>
        <div class="ui top attached orange segment">
          <button class="ui right floated mini red icon button" @click="clearAllFeatures">
            <i class="remove icon"></i>
            Clear All
          </button>
          <div class="header">
            Select to show in map
          </div>
        </div>

        <!-- The reservedStads menu item-->
        <div
          :class="{active: geojson.allStands.features, item: true, link: true}">

          <!-- Fetch reserved items when you click here -->
          <a
            @click="fetchAllStands">
            All Stands
          </a>

          <!-- show the user a red zero if there are no reserved items -->
          <div
            class="ui red basic label"
            v-if = "geojson.allStands.type && !!geojson.allStands.features === false">
            0
          </div>

          <!-- show the user the number of reserved items -->
          <div
            class="ui brown basic label"
            v-if = "geojson.allStands.features">
            {{ geojson.allStands.features.length }}
          </div>

          <!-- Allow the user to toggle the layers if they are present -->
          <div
            v-if = "geojson.allStands.features">
            <p>
              <div class="ui slider checkbox">
                <input
                  type="checkbox"
                  :checked="isLayerInMap('allStands')"
                  @click="toggleLayer('allStands')">
                <label>Show in map</label>
              </div>
            </p>
          </div>

        </div><!--/ The reservedStands menu item -->

        <!-- The availableStads menu item-->
        <div
          :class="{active: geojson.availableStands.features, item: true, link: true}">

          <!-- Fetch reserved items when you click here -->
          <a
            @click="fetchavailableStands">
            Available Stands
          </a>

          <!-- show the user a red zero if there are no reserved items -->
          <div
            class="ui red basic label"
            v-if = "geojson.availableStands.type && !!geojson.availableStands.features === false">
            0
          </div>

          <!-- show the user the number of reserved items -->
          <div
            class="ui purple basic label"
            v-if = "geojson.availableStands.features">
            {{ geojson.availableStands.features.length }}
          </div>

          <!-- Allow the user to toggle the layers if they are present -->
          <div
            v-if = "geojson.availableStands.features">
            <p>
              <div class="ui slider checkbox">
                <input
                  type="checkbox"
                  :checked="isLayerInMap('availableStands')"
                  @click="toggleLayer('availableStands')">
                <label>Show in map</label>
              </div>
            </p>
          </div>

        </div><!--/ The reservedStands menu item -->

        <!-- The reservedStads menu item-->
        <div
          :class="{active: geojson.reservedStands.features, item: true, link: true}">

          <!-- Fetch reserved items when you click here -->
          <a
            @click="fetchReservedStands">
            Reserved Stands
          </a>

          <!-- show the user a red zero if there are no reserved items -->
          <div
            class="ui red basic label"
            v-if = "geojson.reservedStands.type && !!geojson.reservedStands.features === false">
            0
          </div>

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
              <div class="ui slider checkbox">
                <input
                  type="checkbox"
                  :checked="isLayerInMap('reservedStands')"
                  @click="toggleLayer('reservedStands')">
                <label>Show in map</label>
              </div>
            </p>
          </div>

        </div><!--/ The reservedStands menu item -->

        <!-- The reservedStads menu item-->
        <div
          :class="{active: geojson.soldStands.features, item: true, link: true}">

          <!-- Fetch reserved items when you click here -->
          <a
            @click="fetchSoldStands">
            Sold Stands
          </a>


          <!-- show the user a red zero if there are no sold items -->
          <div
            class="ui red basic label"
            v-if = "geojson.soldStands.type && !!geojson.soldStands.features === false">
            0
          </div>

          <!-- show the user the number of reserved items -->
          <div
            class="ui green basic label"
            v-if = "geojson.soldStands.features">
            {{ geojson.soldStands.features.length }}
          </div>

          <!-- Allow the user to toggle the layers if they are present -->
          <div
            v-if = "geojson.soldStands.features">
            <p>
              <div class="ui slider checkbox">
                <input
                  type="checkbox"
                  :checked="isLayerInMap('soldStands')"
                  @click="toggleLayer('soldStands')">
                <label>Show in map</label>
              </div>
            </p>
          </div>

        </div><!--/ The soldStands menu item -->

        <!-- Other menu items will come down here -->

      </div>

      <!--Show categorised stands down here (only if there a stands to be zoomed to)
          so that user can zoom to them in the map -->
      <div v-if = "menus.length" class="ui orange segment">

        <!-- The togglable headers of the stands displayed as tabular menus -->
        <div class="ui small tabular menu">
          <a v-for = "menu in menus" :class="{active: menu.active, item: true}" @click="selectMenu(menu)">{{menu.title}}</a>
        </div>

        <!-- Search for the stand -->
        <div class="ui fluid mini left icon search input">
          <i class="search icon"></i>
          <input v-model:value="searchStandString" placeholder="Filter using stand ID, township or city" @keyup.enter="searchStand">
          <button v-if="searchStandString" @click="searchStandString = ''" class="ui mini circular red icon reset button"><i class="remove icon"></i></button>
        </div>

        <!-- Divide the search input and the stands -->
        <div class="ui divider"></div>

        <!-- Show stands to be zoomed to here-->
        <div class="ui small stands list">

          <!-- Iterate the standsList to show them-->
          <div  v-for = "stand in standsList" class="item link">
            <div :class="{ui: true, fluid: true, mini: stand.standid !== selectedStandID, basic: true, icon: true, active: stand.standid === selectedStandID, button: true}" @click="flyToStand(stand)">
              <i class="send icon"></i>
              <b>{{stand.standid}} in {{stand.township}}, {{stand.city}}</b>
            </div>
          </div>

          <!-- Show a message if there are no stands to show-->
          <div class="item" v-if="!standsList.length">
            <div class="ui disabled segment">
              <h1><i class = "battery empty icon"></i>There's nothing to show here!</h1>
            </div>
          </div>
        </div>
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

import axios from '@/modules/axios'
import polylabel from 'polylabel'
import moment from 'moment'
import BuySummary from '@/components/BuySummary'

export default {
  /*
    Dynamic values that are used by components,
    Updates in real time.
  */
  computed: {
    /*
      The geojson of the cities brought by the api.
    */
    cities () {
      return this.$store.getters.cities
    },

    allStands () {
      console.log(this.$store.getters.allStands)
      return this.$store.getters.allStands
    }
  },
  /*
    The warehouse of this component.
    Store anything that is required by more than
    one function.
  */
  data () {
    return {

      // The geogarphies that will be laid onto the map
      geojson: {
        allStands: {},
        availableStands: {},
        reservedStands: {},
        soldStands: {}
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

      // The registration location of the individual popup html
      popups: {
        allStands: function () {},
        availableStands: function () {},
        reservedStands: function () {},
        soldStands: function () {}
      },

      // Define the queryable layers
      layers: [],

      // Define the style of the layers so that
      // they can be used to recreate the layer during toggling
      layerStyles: [],

      // The tabular menus to toggle between different types of stand
      // to show on the map
      menus: [],

      // The list of stands to show in the list so that the user can
      // zoom to the stand
      standsList: [],

      // The string used to filter the stands in the list
      searchStandString: '',

      // The string used to filter the stands in the list
      selectedStandID: '',

      // True if there is need to show progress
      loading: false,

      openBuySummary: false
    }
  },

  components: {BuySummary},
  /*
    Code that is executed when the component has been compiled
    and ready to be used.
  */
  mounted () {
    // Show the loading progress
    this.showLoading(true)

    // Initilise the map and fetch the cities (static parts of the map)
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

      // Listen to the clicks and show reserve - buy summary
      this.addClickEvent()
    },

    /*
      make the map respond to the clicks on the map
    */
    addClickEvent () {
      this.map.on('click', e => {
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
        if (!features || features.length === 0) {
          this.openBuySummary = false
          return
        }

        // The feature on top of the stack i.e the one pointed by the mouse.
        let feature = features[0]

        // types of states the stand can be in
        let states = [{
          id: 'reservedStands', value: 'reserved'
        },
        {
          id: 'soldStands', value: 'sold'
        },
        {
          id: 'availableStands', value: 'available'
        }]

        console.log(feature)

        states.forEach(featureType => {
          feature = Array.isArray(feature) ? feature[0] : feature
          if (featureType.id === feature.layer.id) {
            this.$store.commit('clickOnStand', {
              standid: feature.properties.standid,
              status: featureType.value
            })

            this.openBuySummary = true
          }
        })
      })
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

          // Show the appropriate popup when hovering a feature
          // Differentiate using the layer.id because it is guaranteed
          // To be unique for all use cases

          let popupHTML = this.popups[feature.layer.id](feature)

          // Place some data in the popup and add it to the map
          this.popup.setHTML(popupHTML)
            .addTo(this.map)
        }
      })
    },

    /*
      when the map loads add cities sources
      and create the static layers for them
    */
    addLoadEvent () {
      // Listen to the load event
      this.map.on('load', () => {
        this.updateCitiesSource()
        this.updateCitiesLayer()
        // Add the Naviagtion control that allows one to pan and zoom the map
        this.map.addControl(new mapboxgl.NavigationControl())

        // Disable the loading progress
        this.showLoading(false)
      })
    },

    /*
      fetch data for the stands and store it in the data() function
    */
    fetchAllStands () {
      // Show the loading progress
      this.showLoading(true)
      this.$store.dispatch('getAllStands')
    },

    /*
      fetch data for the all the standsthat are alvailabe
      for sale or for reservations and store it in the data() function
    */
    fetchavailableStands () {
      // fix for calling this component inside functions where this will be undifined
      var _this = this

      // Show the loading progress
      this.showLoading(true)

      // fetch the geojson from server
      axios.get('/stands/available?map=true')
        .then(response => {
          // Store the response for later use
          this.geojson.availableStands = response.data.availablestandsmap[0]

          // first check if there are any features in the geojson
          if (!!this.geojson.availableStands.features === false) {
            // Exit the function if there aren't
            this.showLoading(false)
            return
          }

          // only add the source if the source has not been added before
          if (!this.map.getSource('availableStands')) {
            // add source
            this.map.addSource('availableStands', {
              type: 'geojson',
              'data': _this.geojson.availableStands
            })
          }

          // Destroy any layer for stands and add a new one
          if (this.map.getLayer('availableStands')) {
            this.map.removeLayer('availableStands')
          }

          // Define the availableStandsStyle
          let availableStandsStyle = {
            'id': 'availableStands',
            'type': 'fill',
            'source': 'availableStands',
            'paint': {
              'fill-color': 'purple',
              'fill-opacity': 0.7,
              'fill-outline-color': 'white'
            }
          }

          // Add stands layer
          this.map.addLayer(availableStandsStyle)

          // Then register the layer with the component's data
          this.layers.push('availableStands')

          // Then register the style  with the component's data
          this.layerStyles.push(availableStandsStyle)

          this.popups.availableStands = function (feature) {
            let stand = feature.properties

            let popupHTML = `
            <div clas = "ui list">
              <div class = "item">
                <div class = "ui basic purple inverted segment">AVAILABLE</div>
              </div>
              <br>
              <div class = "item">
                <h3 class = "ui header">Stand <div class="ui horizontal purple label"> ${stand.standid} </div></h3>
                <div class="ui divider">
              </div>

              <div class="item">
                <div class="content">
                  <strong class="header">
                  ${stand.township}
                    Township
                  </strong>
                  <div class="description">
                  </div>
                </div>
              </div>

              <div class="item">
                <div class="content">
                  <strong class="header">
                    City
                  </Strong>
                  <div class="description">
                    ${stand.city}
                  </div>
                </div>
              </div>

            </div>
            `
            return popupHTML
          }

          // the menu variable to be shown in the tabular menu
          let availableStandsMenu = {
            id: 'availableStands',
            title: 'Available',
            active: true
          }

          // register the menu only if it has not been registered
          if (this.menus.find(menu => { return menu.id === availableStandsMenu.id }) === undefined) {
            this.menus.push(availableStandsMenu)
          }

          // Then select the menu deselecting others in the process
          this.selectMenu(availableStandsMenu)

          // Disable the loading progress
          this.showLoading(false)
        })
        .catch(err => {
          if (err) {
            console.log(err)

            // Disable the loading progress
            this.showLoading(false)
          }
        })
    },

    /*
      fetch the data for the cities and store it in vuex
    */
    fetchBaseItems () {
      this.$store.dispatch('getBaseLayer')
    },

    /*
      fetch the reservedStands and store them locally in the data() function
    */
    fetchReservedStands () {
      // fix for calling this component inside functions where this will be undifined
      var _this = this

      // Show the loading progress
      this.showLoading(true)

      // fetch the geojson from server
      axios.get('/stands/reservations?map=true')
        .then(response => {
          // Found the data! save it locally
          this.geojson.reservedStands = response.data.reservedstandsmap[0]

          // first check if there are any features in the geojson
          if (!!this.geojson.reservedStands.features === false) {
            // Exit the function if there aren't
            this.showLoading(false)
            return
          }

          // only add the source if the source has not been added before
          if (!this.map.getSource('resevedStands')) {
            // add source
            this.map.addSource('reservedStands', {
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
            'source': 'reservedStands',
            'paint': {
              'fill-color': 'orange',
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

          this.popups.reservedStands = function (feature) {
            let stand = feature.properties

            let popupHTML = `
            <div clas = "ui list">
              <div class = "item">
                <div class = "ui basic orange inverted segment">RESERVED</div>
              </div>
              <br>
              <div class = "item">
                <h3 class = "ui header">Stand <div class="ui horizontal orange label"> ${stand.standid} </div></h3>

                <div class = "ui divider"></div>

              </div>

              <div class = "item">
                <div class = "content">
                  <strong class="header">Reserved By</strong>
                  <div class = "description">
                    ${stand.firstname} ${stand.surname}
                  </div>
                </div>
              </div>

              <div class = "item">
                <div class = "content">
                  <strong class="header">Reserved</strong>
                  <div class = "description">
                    ${_this.humaniseDate(stand.reservationdate)}
                  </div>
                </div>
              </div>

              <div class = "item">
                <div class = "content">
                  <strong class="header">Expiring</strong>
                  <div class = "description">
                    <div class = "ui warning message">
                      ${_this.humaniseDate(stand.expirydate)}
                    </div>
                  </div>
                </div>
              </div>

            </div>
            `
            return popupHTML
          }

          // the menu variable to be shown in the tabular menu
          let reservedStandsMenu = {
            id: 'reservedStands',
            title: 'Reserved',
            active: true
          }

          // register the menu only if it has not been registered
          if (this.menus.find(menu => { return menu.id === reservedStandsMenu.id }) === undefined) {
            this.menus.push(reservedStandsMenu)
          }

          // Then select the menu deselecting others in the process
          this.selectMenu(reservedStandsMenu)

          // Disable the loading progress
          this.showLoading(false)
        })
      .catch(err => {
        if (err) {
          console.log(err)

          // Disable the loading progress
          this.showLoading(false)
        }
      })
    },

    /*
      fetch the soldStands and store them locally in the data() function
    */
    fetchSoldStands () {
      // fix for calling this component inside functions where this will be undifined
      var _this = this

      // Show the loading progress
      this.showLoading(true)

      // fetch the geojson from server
      axios.get('/stands/sold?map=true')
        .then(response => {
        // Found the data! save it locally
          this.geojson.soldStands = response.data.soldstandsmap[0]

          // first check if there are any features in the geojson
          if (!!this.geojson.soldStands.features === false) {
            // Exit the function if there aren't
            this.showLoading(false)
            return
          }

          // only add the source if the source has not been added before
          if (!this.map.getSource('soldStands')) {
            // add source
            this.map.addSource('soldStands', {
              type: 'geojson',
              'data': _this.geojson.soldStands
            })
          }

          // Destroy any layer for reserved stands and add a new one
          if (this.map.getLayer('soldStands')) {
            this.map.removeLayer('soldStands')
          }

          // Define the reservedStandsStyle
          let soldStandsStyle = {
            'id': 'soldStands',
            'type': 'fill',
            'source': 'soldStands',
            'paint': {
              'fill-color': 'green',
              'fill-opacity': 0.7,
              'fill-outline-color': 'sienna'
            }
          }

          // Add stands layer
          this.map.addLayer(soldStandsStyle)

          // Then register the layer with the component's data
          this.layers.push('soldStands')

          // Then register the style  with the component's data
          this.layerStyles.push(soldStandsStyle)

          this.popups.soldStands = function (feature) {
            let stand = feature.properties

            let popupHTML = `
            <div clas = "ui list">
              <div class = "item">
                <div class = "ui basic green inverted segment">SOLD</div>
              </div>
              <br>
              <div class = "item">
                <h3 class = "ui header">Stand <div class="ui horizontal green label"> ${stand.standid} </div></h3>

                <div class = "ui divider"></div>

              </div>

              <div class = "item">
                <div class = "content">
                  <strong class="header">Sold to</strong>
                  <div class = "description">
                    ${stand.firstname} ${stand.surname}
                  </div>
                </div>
              </div>

              <div class = "item">
                <div class = "content">
                  <strong class="header">Email</strong>
                  <div class = "description">
                    <a href="mailto:${stand.email}">${stand.email}</a>
                  </div>
                </div>
              </div>

            </div>
            `
            return popupHTML
          }

          // the menu variable to be shown in the tabular menu
          let soldStandsMenu = {
            id: 'soldStands',
            title: 'Sold',
            active: false
          }

          // register the menu only if it has not been registered
          if (this.menus.find(menu => { return menu.id === soldStandsMenu.id }) === undefined) {
            this.menus.push(soldStandsMenu)
          }

          // Then select the menu deselecting others in the process
          this.selectMenu(soldStandsMenu)

          // Disable the loading progress
          this.showLoading(false)
        })
      .catch(err => {
        if (err) {
          console.log(err)

          // Disable the loading progress
          this.showLoading(false)
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
        this.popup.remove()

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
    },

    /*
      Set the currently selected menu to be active while deactivating other menus
    */
    selectMenu (selectedMenu) {
      // find out if there are other menus
      let otherMenus = this.menus.filter(menu => {
        return selectedMenu.id !== menu.id
      })

      // deactivate other menus if they exist
      if (otherMenus.length > 0) {
        otherMenus.map(menu => {
          menu.active = false
        })
      }

      // then activate the selected menu
      this.menus.find(menu => {
        return selectedMenu.id === menu.id
      }).active = true

      // Refresh the stands list and show the appropriate stands depending on the selected menu
      this.showStandsByMenu()
    },

    /*
      Filter the stands to be shown in the list of stands
    */
    searchStand () {
      let value = this.searchStandString

      value = value.toLowerCase()

      // Only start filtering if the search string is > 2 for perfomance reasons
      // (also returns more relevant result)
      if (this.searchStandString.length > 2) {
        this.standsList = this.standsList.filter(stand => {
          // filter by standid, township or city
          return stand.standid.indexOf(value) > -1 ||
                 stand.township.toLowerCase().indexOf(value) > -1 ||
                 stand.city.toLowerCase().indexOf(value) > -1
        })
      }
    },

    /*
      Detemine which menu is selected then filter the stands to show in the list
      Mostly used for initialisation and reset methods
    */
    showStandsByMenu () {
      // find the active menu
      let selectedStandMenu = this.menus.find(menu => {
        return menu.active === true
      })

      // If there is no active menu it means there is no menu at all.
      // return an empty array
      if (!selectedStandMenu) {
        return []
      }

      var _this = this

      switch (selectedStandMenu.id) {
        case 'reservedStands':
          _this.standsList = []
          dynamicallyPushStands(this.geojson.reservedStands.features)
          break

        case 'soldStands':
          _this.standsList = []
          dynamicallyPushStands(this.geojson.soldStands.features)
          break

        case 'allStands':
          _this.standsList = []
          dynamicallyPushStands(this.allStands.features)
          break

        case 'availableStands':
          _this.standsList = []
          dynamicallyPushStands(this.geojson.availableStands.features)
          break
        default:

      }

      function dynamicallyPushStands (features) {
        features.forEach(feature => {
          // Only push what is required to save memory
          let standid = feature.properties.standid
          let township = feature.properties.township
          let city = feature.properties.city
          let coordinates = feature.geometry.coordinates

          _this.standsList.push({
            standid,
            township,
            city,
            coordinates
          })
        })
      }

      // Done! Return the list of fresh stands
      return this.standsList
    },

    /*
      Fly to the selected stand in the  and show popup
    */
    flyToStand (stand) {
      var _this = this

      // Use polylabel to find the centre of the stand then fly to it
      _this.map.flyTo({
        center: polylabel(stand.coordinates[0], 1.0),
        zoom: 18
      })

      // Highlight the appropiate stand button
      _this.selectedStandID = stand.standid

      // find the active menu
      let selectedStandMenu = _this.menus.find(menu => {
        return menu.active === true
      })

      switch (selectedStandMenu.id) {
        case 'reservedStands':
          let feature = _this.geojson.reservedStands.features.find(feature => {
            return feature.properties.standid === stand.standid
          })

          // Show html specific to the stand
          let popupHTML = _this.popups.reservedStands(feature)

          showStandPopupOnMap(feature, popupHTML)
          break

        case 'soldStands':
          feature = _this.geojson.soldStands.features.find(feature => {
            return feature.properties.standid === stand.standid
          })

          // Show html specific to the stand
          popupHTML = _this.popups.soldStands(feature)

          // Show html specific to the stand
          showStandPopupOnMap(feature, popupHTML)
          break

        case 'allStands':
          feature = _this.geojson.allStands.features.find(feature => {
            return feature.properties.standid === stand.standid
          })

          // Show html specific to the stand
          popupHTML = _this.popups.allStands(feature)

          // Show html specific to the stand
          showStandPopupOnMap(feature, popupHTML)
          break

        case 'availableStands':
          feature = _this.geojson.availableStands.features.find(feature => {
            return feature.properties.standid === stand.standid
          })

          // Show html specific to the stand
          popupHTML = _this.popups.availableStands(feature)

          // Show html specific to the stand
          showStandPopupOnMap(feature, popupHTML)
          break
        default:
      }

      /*
        Set the Long and Lat for the popup.
        Assign html to the popup
        Then add it to the map
      */
      function showStandPopupOnMap (feature, popupHTML) {
        // Using a the [0] because the coodinates in the geojson are one array
        // above the coodinates on the map. Compare with the popup actions in
        // in the mousemove event.
        _this.popup.setLngLat(polylabel(feature.geometry.coordinates[0]))

        // Place some data in the popup and add it to the map
        _this.popup.setHTML(popupHTML)
          .addTo(_this.map)
      }
    },

    /*
      Change the dates in ISO_8601 format into more human readable format
      relative to today's date.
      e.g  2017-05-11T00:00:00 ==> 2 days ago
    */
    humaniseDate (date) {
      return moment().to(moment(date, moment.ISO_8601))
    },

    showLoading (value) {
      this.loading = !!value || false
    },

    /*
      Reset the state of the map view to that in which it was when
      the view was first loaded.
    */
    clearAllFeatures () {
      // Loop through the geojsons and clear them all
      for (let key in this.geojson) {
        this.geojson[key] = {}
      }

      // remove the Layers and coresponding Sources
      this.layers.forEach(layer => {
        this.map.removeLayer(layer)
        this.map.removeSource(layer)
      })

      // then clear everything else
      this.menus = []
      this.standsList = []
      this.layers = []
      this.popup.remove()
    },

    //
    updateCitiesSource () {
      if (this.map.getSource('cities')) {
        this.map.removeSource('cities')
      }

      // Add cities source
      this.map.addSource('cities', {
        type: 'geojson',
        'data': this.cities
      })
    },

    updateCitiesLayer () {
      if (this.map.getLayer('cities')) {
        this.map.removeLayer('cities')
      }

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
    }
  },

  /*
    Variables registered in the data() that should trigger certain actions
    should they change their value. REACTIVITY!
  */
  watch: {

    /*
      Refresh the stands list and show the appropriate stands depending on the selected menu
    */
    menus () {
      this.showStandsByMenu()
    },

    /*
      If the searchStandString is empty, refresh the stands list and show the
      appropriate stands depending on the selected menu
    */
    searchStandString () {
      if (this.searchStandString === '') {
        this.showStandsByMenu()
      }
    },

    allStands () {
      // first check if there are any features in the geojson
      if (!!this.allStands.features === false) {
        // Exit the function if there aren't
        this.showLoading(false)
        return
      }

      // only add the source if the source has not been added before
      if (!this.map.getSource('allStands')) {
        // add source
        this.map.addSource('allStands', {
          type: 'geojson',
          'data': this.allStands
        })
      }

      // Destroy any layer for stands and add a new one
      if (this.map.getLayer('allStands')) {
        this.map.removeLayer('allStands')
      }

      // Define the allStandsStyle
      let allStandsStyle = {
        'id': 'allStands',
        'type': 'fill',
        'source': 'allStands',
        'paint': {
          'fill-color': 'brown',
          'fill-opacity': 0.7,
          'fill-outline-color': 'white'
        }
      }

      // Add stands layer
      this.map.addLayer(allStandsStyle)

      // Then register the layer with the component's data
      this.layers.push('allStands')

      // Then register the style  with the component's data
      this.layerStyles.push(allStandsStyle)

      this.popups.allStands = function (feature) {
        let stand = feature.properties

        let popupHTML = `
        <div clas = "ui list">
          <div class = "item">
            <div class = "ui basic brown inverted segment">ALL STANDS</div>
          </div>
          <br>
          <div class = "item">
            <h3 class = "ui header">Stand <div class="ui horizontal brown label"> ${stand.standid} </div></h3>
            <div class="ui divider">
          </div>

          <div class="item">
            <div class="content">
              <strong class="header">
                Township
              </strong>
              <div class="description">
                ${stand.township}
              </div>
            </div>
          </div>

          <div class="item">
            <div class="content">
              <strong class="header">
                City
              </Strong>
              <div class="description">
                ${stand.city}
              </div>
            </div>
          </div>

        </div>
        `
        return popupHTML
      }

      // the menu variable to be shown in the tabular menu
      let allStandsMenu = {
        id: 'allStands',
        title: 'All',
        active: true
      }

      // register the menu only if it has not been registered
      if (this.menus.find(menu => { return menu.id === allStandsMenu.id }) === undefined) {
        this.menus.push(allStandsMenu)
      }

      // Then select the menu deselecting others in the process
      this.selectMenu(allStandsMenu)

      // Disable the loading progress
      this.showLoading(false)
    }
  }
}

</script>

<style lang='css' scoped>
  /*
    the map!
  */
  #mapview {
    height: 500px;
    width: 100%;
  }

  /*
    the list showing the list of stands
  */
  .ui.small.stands.list {
    max-height:300px;
    overflow-x: auto;
  }

  /*
    The reset button
  */
  .reset.button{
    margin-left:10px;
  }
</style>
