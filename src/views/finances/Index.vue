<template>
  <div class="ui container grid">
    <div class="row">

        <!--the menu that poins to the sub routes of the stands view -->
        <div class="ui purple secondary pointing container menu">
          <router-link to="/finances" class="active item">History</router-link>
          <router-link to="/finances/summary" class="item">Summary</router-link>
        </div>

        <!-- the subroutes to the stands view will be rendered here -->
        <router-view></router-view>
    </div>

  </div>
</template>

<script>
export default {
}
</script>

<style lang="css">
</style>
