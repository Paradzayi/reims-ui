<template>
  <div id="app" class="row">
    <sidebar
      :menus = "sidebarMenus"
    >
    </sidebar>
    <div class="col-sm-9 col-sm-offset-3">
      <router-view></router-view>
    </div>
  </div>
</template>

<!-- declare these external scripts first before exporting the app component -->
<!-- JQuery required by bootstrap and admin lte -->
<script src="./assets/vendor/jQuery/jquery-2.2.3.min.js" charset="utf-8"></script>

<script>
  import Sidebar from './components/Sidebar/Sidebar.vue'
  import config from './modules/config'

  export default {
    name: 'app',

    components: {
      Sidebar
    },

    data () {
      return {
        sidebarMenus: config.sidebar.menus
      }
    }
  }
</script>

<style src="./assets/vendor/bootstrap/css/bootstrap.min.css"></style>
<style media="screen">
  #app {
    height: 100%;
  }
</style>
