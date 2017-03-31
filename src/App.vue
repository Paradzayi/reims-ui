<template>
  <div id="app" class="row">
    <sidebar
      :menus = "sidebarMenus"
    >
    </sidebar>
    <div class="col-sm-11 main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

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

<style media="screen">
  #app {
    height: 100%;
  }
  .main-content {
    left: 80px;
  }
</style>
