<template >
  <div :class="messageCss" v-if="message">
    <i :class="iconCss"></i>{{message}}
  </div>
</template>

<script>
export default {
  props: ['message', 'type'],

  computed: {
    messageCss () {
      return {
        ui: true,
        positive: this.type === 'info' || this.type === 'success',
        negative: this.type === 'error',
        message: true
      }
    },

    iconCss () {
      return {
        check: this.type === 'success',
        warning: this.type === 'error',
        icon: true
      }
    }
  }
}

</script>

<style lang="css">
</style>
