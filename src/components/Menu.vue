<template>
  <div class="ui mini orange segment">
    <div class="ui secondary large orange menu">
      <a href="#/" id="home" @click="selectMenu('home')" class="active item">Home</a>
      <a href="#/stands" id="stands" @click="selectMenu('stands')" class="item">Stands</a>
      <a href="#/clients" id="clients" @click="selectMenu('clients')" class="item">Clients</a>
      <a href="#/finances" id="finances" @click="selectMenu('finances')" class="item">Finances</a>
    </div>
  </div>
</template>

<script>
import menu from '@/modules/menu'

export default {
  data () {
    return {
      menus: [
        'home', 'stands', 'clients', 'finances'
      ]
    }
  },
  methods: {
    selectMenu (value) {
      menu.changeMenuClases(value, this.menus, this.$el)
    }
  },
  mounted () {
    let path = this.$route.path
    let selectedMenu = path.substring(path.lastIndexOf('/') + 1, path.length)
    menu.changeMenuClases(selectedMenu, this.menus, this.$el)
  }
}
</script>

<style lang="css" scoped>
.ui.mini.orange.segment {
  height: 60px;
}
</style>
