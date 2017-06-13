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

  export default {
    name: 'app',

    components: {
      MyMenu: Menu
    },

    data () {
      return {}
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
<style src="@/assets/vendor/semantic-ui/semantic-ui.min.css">

</style>

<!-- Custom css from my app-->
<style src="@/assets/stylesheets/main.css"></style>
