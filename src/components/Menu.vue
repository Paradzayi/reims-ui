<template>
  <div class="ui secondary orange pointing menu">
    <a href="#" @click="selectMenu('')">Click me</a>
    <a href="#/" id="home" @click="selectMenu('home')" class="active item">Home</a>
    <a href="#/stands" id="stands" @click="selectMenu('stands')" class="item">Stands</a>
    <a href="#/clients" id="clients" @click="selectMenu('clients')" class="item">Clients</a>
    <a href="#/finances" id="finances" @click="selectMenu('finances')" class="item">Finances</a>
  </div>
</template>

<script>
import menu from '@/modules/menu'

export default {
  methods: {
    selectMenu (value) {
      let menus = [
        'home', 'stands', 'clients', 'finances'
      ]
      menu.changeMenuClases(value, menus, this.$el)
    }
  }
}
</script>

<style lang="css">
</style>
