<template>
  <div class="ui vertical fluid  menu">
    <div class="ui top attached raised orange segment">
      <button class="ui right floated mini circular icon button" @click="emitCloseEvent">
        <i class="orange remove icon"></i>
      </button>
      Action
    </div>

    <div class="item">
      <div class="content">
        <message :message = "message.text" :type="message.type"/>
        <p>Stand {{stand.standid}} is {{stand.status}}.</p>

        <!--Show reserve button if the stand is available -->
        <button class="ui orange basic small button"
          @click="reserveStand"
          v-if="stand.status === 'available'">RESERVE</button>

        <!--Show buy button if the user reserved the stand (if reserved) or if the stand is available -->
        <button class="ui green basic small button"
          v-if="stand.status === 'available'">BUY</button>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from '@/modules/axios'
  import Message from './Message'
  import querystring from 'querystring'
  import moment from 'moment'

  export default {
    name: 'BuySummary',
    data () {
      return {
        message: {
          text: '',
          type: ''
        }
      }
    },

    computed: {
      stand () {
        return this.$store.state.stands.clickedStand
      }
    },
    components: {Message},

    methods: {
      reserveStand () {
        axios.post('/stands/reservations', querystring.stringify({
          clientid: '63-2052070-T-18', // use this temporarilly. soon use the authenticated user
          standid: this.stand.standid,
          reservationdate: moment().format(),
          period: 7
        }))

        .then((response) => {
          this.message.text = response.data.message
          this.message.type = 'success'
          this.loading = false
        })
        .catch((error) => {
          console.log(error)
          this.message.text = 'An error occured an we could not complete the reservation.'
          this.message.type = 'error'
          this.loading = false
        })
      },

      emitCloseEvent () {
        this.$emit('close')
      }
    }
  }
</script>

<style>
</style>
