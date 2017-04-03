<template>
  <div class="ui container grid">
    <div class="row">

        <!--the menu that poins to the sub routes of the stands view -->
        <div class="ui purple secondary pointing container menu">
          <router-link to="/stands" class="active item">All</router-link>
          <router-link to="/stands/available" class="item">Available</router-link>
          <router-link to="/stands/reserved" class="item">Reserved</router-link>
          <router-link to="/stands/sold" class="item">Sold</router-link>
        </div>

        <!-- the subroutes to the stands view will be rendered here -->
        <router-view></router-view>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      number: 0
    }
  }
}
</script>

<style lang="css">
</style>
