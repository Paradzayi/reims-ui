<template >
  <div :class="messageCss" v-if="message">
    <i :class="iconCss"></i>{{message}}
    <button class="ui mini circular icon close button" @click="message = ''">
      <i class="red remove icon"></i>
    </button>
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

<style lang="css" scoped>
  .ui.circular.close {
    float: right;
  }
</style>
