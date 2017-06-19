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
      <MapSideMenu
        :allStands="allStands"
        :availableStands="availableStands"
        :reservedStands="reservedStands"
        :soldStands="soldStands"

        @clearAllFeatures="clearAllFeatures"
        @fetchAllStands="fetchAllStands"
        @fetchAvailableStands="fetchAvailableStands"
        @fetchReservedStands="fetchReservedStands"
        @fetchSoldStands="fetchSoldStands"
        @toggleLayer="toggleLayer">
      </MapSideMenu>

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

import polylabel from 'polylabel'
import moment from 'moment'
import BuySummary from '@/components/BuySummary'
import MapSideMenu from '@/components/MapSideMenu'

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
      return this.$store.getters.allStands
    },

    availableStands () {
      return this.$store.getters.availableStands
    },

    reservedStands () {
      return this.$store.getters.reservedStands
    },

    soldStands () {
      return this.$store.getters.soldStands
    },

    // The list of stands to show in the list so that the user can
    // zoom to the stand
    standsList () {
      return this.$store.getters.standsList
    },

    layers () {
      return this.$store.getters.layers
    }
  },
  /*
    The warehouse of this component.
    Store anything that is required by more than
    one function.
  */
  data () {
    return {

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

      // The tabular menus to toggle between different types of stand
      // to show on the map
      menus: [],

      // The string used to filter the stands in the list
      searchStandString: '',

      // The string used to filter the stands in the list
      selectedStandID: '',

      // True if there is need to show progress
      loading: false,

      openBuySummary: false
    }
  },

  components: {
    BuySummary,
    MapSideMenu
  },
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

        states.forEach(featureType => {
          feature = Array.isArray(feature) ? feature[0] : feature
          if (featureType.id === feature.layer.id) {
            this.$store.commit('CLICK_ON_STAND', {
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
    fetchAvailableStands () {
      this.showLoading(true)
      this.$store.dispatch('getAvailableStands')
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
      // Show the loading progress
      this.showLoading(true)
      this.$store.dispatch('getReservedStands')
    },

    /*
      fetch the soldStands and store them locally in the data() function
    */
    fetchSoldStands () {
      // Show the loading progress
      this.showLoading(true)
      this.$store.dispatch('getSoldStands')
    },
    /*
      add or remove layers. Says no to frequent server requests
    */
    toggleLayer (value) {
      if (this.isLayerInMap(value) === true) {
        const currentVisibility = this.map.getLayoutProperty(value, 'visibility')
        const visibility = currentVisibility === 'visible'
          ? 'none'
          : 'visible'

        this.map.setLayoutProperty(value, 'visibility', visibility)
        this.$store.commit('TOGGLE_LAYER', value)
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
        this.$store.commit('NEW_STANDS_LIST',
          this.standsList.filter(stand => stand.standid.indexOf(value) > -1 || stand.township.toLowerCase().indexOf(value) > -1 || stand.city.toLowerCase().indexOf(value) > -1)
        )
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
      var standsList = []

      switch (selectedStandMenu.id) {
        case 'reservedStands':
          dynamicallyPushStands(this.reservedStands.features)
          break

        case 'soldStands':
          dynamicallyPushStands(this.soldStands.features)
          break

        case 'allStands':
          dynamicallyPushStands(this.allStands.features)
          break

        case 'availableStands':
          dynamicallyPushStands(this.availableStands.features)
          break
        default:

      }

      function dynamicallyPushStands (features) {
        features.forEach(feature => {
          // Only push what is required to save memory
          standsList.push({
            standid: feature.properties.standid,
            township: feature.properties.township,
            city: feature.properties.city,
            coordinates: feature.geometry.coordinates
          })
        })

        _this.$store.commit('NEW_STANDS_LIST', standsList)
      }
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
          let feature = _this.reservedStands.features.find(feature => {
            return feature.properties.standid === stand.standid
          })

          // Show html specific to the stand
          let popupHTML = _this.popups.reservedStands(feature)

          showStandPopupOnMap(feature, popupHTML)
          break

        case 'soldStands':
          feature = _this.soldStands.features.find(feature => {
            return feature.properties.standid === stand.standid
          })

          // Show html specific to the stand
          popupHTML = _this.popups.soldStands(feature)

          // Show html specific to the stand
          showStandPopupOnMap(feature, popupHTML)
          break

        case 'allStands':
          feature = _this.allStands.features.find(feature => {
            return feature.properties.standid === stand.standid
          })

          // Show html specific to the stand
          popupHTML = _this.popups.allStands(feature)

          // Show html specific to the stand
          showStandPopupOnMap(feature, popupHTML)
          break

        case 'availableStands':
          feature = _this.availableStands.features.find(feature => {
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
      // remove the Layers and coresponding Sources
      this.layers.forEach(layer => {
        this.map.removeLayer(layer)
        this.map.removeSource(layer)
      })

      // then clear everything else
      this.menus = []
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
        },
        'layout': {
          'visibility': 'visible'
        }
      }

      // Add stands layer
      this.map.addLayer(allStandsStyle)

      // Then register the layer with the component's data
      this.$store.commit('NEW_LAYER', {
        id: 'allStands',
        active: true
      })

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
    },

    availableStands () {
      // first check if there are any features in the geojson
      if (!!this.availableStands.features === false) {
        // Exit the function if there aren't
        this.showLoading(false)
        return
      }

      // only add the source if the source has not been added before
      if (!this.map.getSource('availableStands')) {
        // add source
        this.map.addSource('availableStands', {
          type: 'geojson',
          'data': this.availableStands
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
        },
        'layout': {
          'visibility': 'visible'
        }
      }

      // Add stands layer
      this.map.addLayer(availableStandsStyle)

      // Then register the layer with the component's data
      this.$store.commit('NEW_LAYER', {
        id: 'availableStands',
        active: true
      })

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
    },

    reservedStands () {
      // first check if there are any features in the geojson
      if (!!this.reservedStands.features === false) {
        // Exit the function if there aren't
        this.showLoading(false)
        return
      }

      // only add the source if the source has not been added before
      if (!this.map.getSource('resevedStands')) {
        // add source
        this.map.addSource('reservedStands', {
          type: 'geojson',
          'data': this.reservedStands
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
        },
        'layout': {
          'visibility': 'visible'
        }
      }

      // Add stands layer
      this.map.addLayer(reservedStandsStyle)

      // Then register the layer with the component's data
      this.$store.commit('NEW_LAYER', {
        id: 'reservedStands',
        active: true
      })

      let _this = this
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
    },

    soldStands () {
      // first check if there are any features in the geojson
      if (!!this.soldStands.features === false) {
        // Exit the function if there aren't
        this.showLoading(false)
        return
      }

      // only add the source if the source has not been added before
      if (!this.map.getSource('soldStands')) {
        // add source
        this.map.addSource('soldStands', {
          type: 'geojson',
          'data': this.soldStands
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
        },
        'layout': {
          'visibility': 'visible'
        }
      }

      // Add stands layer
      this.map.addLayer(soldStandsStyle)

      // Then register the layer with the component's data
      this.$store.commit('NEW_LAYER', {
        id: 'soldStands',
        active: true
      })

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
