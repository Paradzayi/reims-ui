<template>
  <div id="app" class="row">
    <my-menu></my-menu>
    <div class="pusher">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import Menu from './components/Menu.vue'
  import config from './modules/config'

  export default {
    name: 'app',

    components: {
      MyMenu: Menu
    },

    data () {
      return {
        sidebarMenus: config.sidebar.menus
      }
    }
  }
</script>

<style media="screen">
  #app {
    height: 100%;
  }
  .main-content {
    left: 80px;
  }
</style>
