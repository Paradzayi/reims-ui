<template>
  <div class="col-sm-3 col-md-2 sidebar">

  </div>
</template>

<script>
  export default {
  }
</script>

<style scoped>

  /*
   * Sidebar
   */


  .sidebar {
    padding-left: 40px;
    padding-right: 40px;
    overflow-x: hidden;
    overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
    background-color: #f5f5f5;
    border-right: 1px solid #eee;
  }

  /* Sidebar navigation */
  .nav-sidebar {
    margin-right: -21px; /* 20px padding + 1px border */
    margin-bottom: 20px;
    margin-left: -20px;
  }
  .nav-sidebar > li > a {
    padding-right: 20px;
    padding-left: 20px;
  }
  .nav-sidebar > .active > a,
  .nav-sidebar > .active > a:hover,
  .nav-sidebar > .active > a:focus {
    color: #fff;
    background-color: #428bca;
  }

</style>
