<template>
  <div id="app" class="row">
    <sidebar></sidebar>
    <div class="col-md-9">
      <router-view></router-view>
    </div>
  </div>
</template>

<!-- declare these external scripts first before exporting the app component -->
<!-- JQuery required by bootstrap and admin lte -->
<script src="./assets/vendor/jQuery/jquery-2.2.3.min.js" charset="utf-8"></script>

<script>
  import Sidebar from './components/Sidebar/Sidebar.vue'

  export default {
    name: 'app',

    components: {
      Sidebar
    }
  }
</script>

<style src="./assets/vendor/bootstrap/css/bootstrap.min.css"></style>
