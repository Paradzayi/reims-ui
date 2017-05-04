<template>
  <div class="ui container grid">
    <div class="row">

        <!--the menu that poins to the sub routes of the stands view -->
        <div class="ui orange secondary pointing container menu">
          <a href="#/stands" id="all" @click="selectMenu('all')" class="active item">All</a>
          <a href="#/stands/available" id="available" @click="selectMenu('available')" class="item">Available</a>
          <a href="#/stands/reserved" id="reserved" @click="selectMenu('reserved')" class="item">Reserved</a>
          <a href="#/stands/sold" id="sold" @click="selectMenu('sold')" class="item">Sold</a>
        </div>

        <!-- the subroutes to the stands view will be rendered here -->
        <router-view></router-view>
    </div>

  </div>
</template>

<script>
import menu from '@/modules/menu'

export default {
  data () {
    return {
      menus: [
        'all', 'available', 'reserved', 'sold'
      ],
      defaultMenu: 'all',
      parentView: 'stands'
    }
  },
  methods: {
    selectMenu (value) {
      menu.changeMenuClases(value, this.menus, this.$el)
    }
  },
  mounted () {
    let path = this.$route.path
    let selectedMenu = path.substring(path.lastIndexOf('/') + 1, path.length)

    // check if the selected menu points to the /. if it does manually set it to the default menu
    selectedMenu = selectedMenu === this.parentView
      ? this.defaultMenu
      : selectedMenu

    // then higlight the selected menu
    menu.changeMenuClases(selectedMenu, this.menus, this.$el)
  }
}
</script>

<style lang="css">
</style>
