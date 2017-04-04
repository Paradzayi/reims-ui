<template>
  <div class="ui container grid">
    <div class="row">

        <!--the menu that poins to the sub routes of the stands view -->
        <div class="ui purple secondary pointing container menu">
          <a
            id="history"
            href="#/finances"
            @click="selectMenu('history')"
            class="active item">
            History
          </a>

          <a
            id="summary"
            href="#/finances/summary"
            @click="selectMenu('summary')"
            class="item">
            Summary
          </a>

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
        'history', 'summary'
      ],
      defaultMenu: 'history',
      parentView: 'finances'
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
