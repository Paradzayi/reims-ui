<template>
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
          :class="{active: allStands.features, item: true, link: true}">

          <!-- Fetch reserved items when you click here -->
          <a
            @click="fetchAllStands">
            All Stands
          </a>

          <!-- show the user a red zero if there are no reserved items -->
          <div
            class="ui red basic label"
            v-if = "allStands.type && !!allStands.features === false">
            0
          </div>

          <!-- show the user the number of all stands -->
          <div
            class="ui brown basic label"
            v-if = "allStands.features">
            {{allStands.features.length }}
          </div>

          <!-- Allow the user to toggle the layers if they are present -->
          <div
            v-if = "allStands.features">
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
          :class="{active: availableStands.features, item: true, link: true}">

          <!-- Fetch reserved items when you click here -->
          <a
            @click="fetchAvailableStands">
            Available Stands
          </a>

          <!-- show the user a red zero if there are no available items -->
          <div
            class="ui red basic label"
            v-if = "availableStands.type && !!availableStands.features === false">
            0
          </div>

          <!-- show the user the number of available items -->
          <div
            class="ui purple basic label"
            v-if = "availableStands.features">
            {{ availableStands.features.length }}
          </div>

          <!-- Allow the user to toggle the layers if they are present -->
          <div
            v-if = "availableStands.features">
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
          :class="{active: reservedStands.features, item: true, link: true}">

          <!-- Fetch reserved items when you click here -->
          <a
            @click="fetchReservedStands">
            Reserved Stands
          </a>

          <!-- show the user a red zero if there are no reserved items -->
          <div
            class="ui red basic label"
            v-if = "reservedStands.type && !!reservedStands.features === false">
            0
          </div>

          <!-- show the user the number of reserved items -->
          <div
            class="ui orange basic label"
            v-if = "reservedStands.features">
            {{ reservedStands.features.length }}
          </div>

          <!-- Allow the user to toggle the layers if they are present -->
          <div
            v-if = "reservedStands.features">
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
          :class="{active: soldStands.features, item: true, link: true}">

          <!-- Fetch reserved items when you click here -->
          <a
            @click="fetchSoldStands">
            Sold Stands
          </a>


          <!-- show the user a red zero if there are no sold items -->
          <div
            class="ui red basic label"
            v-if = "soldStands.type && !!soldStands.features === false">
            0
          </div>

          <!-- show the user the number of reserved items -->
          <div
            class="ui green basic label"
            v-if = "soldStands.features">
            {{ soldStands.features.length }}
          </div>

          <!-- Allow the user to toggle the layers if they are present -->
          <div
            v-if = "soldStands.features">
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

</template>

<script>
  export default {
    name: 'MapSideMenu',
    props: {
      allStands: Object,
      availableStands: Object,
      reservedStands: Object,
      soldStands: Object
    },

    methods: {
      clearAllFeatures () {
        // Loop through the geojsons and clear them all
        this.$store.commit('CLEAR_ALL_STANDS')

        // notify the parent that all stands have been cleared
        this.$emit('clearAllFeatures')
      },

      fetchAllStands () {
        this.$emit('fetchAllStands')
      },

      fetchAvailableStands () {
        console.log('fetchng available stands')
        this.$emit('fetchAvailableStands')
      },

      fetchReservedStands () {
        this.$emit('fetchReservedStands')
      },

      fetchSoldStands () {
        this.$emit('fetchSoldStands')
      }
    }
  }
</script>
