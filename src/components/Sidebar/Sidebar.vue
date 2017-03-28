<template>
  <div class="sidebar">
    <ul class="nav nav-sidebar">
      <li v-for = "menu in menus">
        <!-- Router links here -->
        <router-link
          :to="menu.url"
          :title="menu.title">

          <!-- Icon shown here -->
          <span :class="menu.icon"></span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>

  export default {
    props: ['menus']
  }

</script>

<style scoped>

  /*
   * Sidebar
   */

  .sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 1000;
    display: block;
    padding-left: 25px;
    overflow-x: hidden;
    overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
    background-color: #f5f5f5;
    border-right: 2px solid #eee;
    width: 70px;
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
