<template>
  <div class="ui container">
    <div class="ui left icon right action input">
        <i class="search icon"></i>
        <input placeholder="Search using client name">
        <button class="ui mini button">Search</button>
    </div>

    <h5 style="color:lightBlue"v-if="loading" class="ui loading fluid orange basic segment">Loading...</h5>

    <div :class="{ui: true, warning : alert.type == 'warning' ?  true : false, error: alert.type == 'error' ?  true : false, message:true }" v-if="alert.show">

      <p><i class="warning sign icon"></i>{{alert.message}}</p>
    </div>
    <div class="ui feed">
      <div class="event" v-for="history in paymentHistory">
        <div class="label">
          <img src="../../assets/img/ProfilePlaceholder250x250.png" class="ui mini circular image">
        </div>
        <div class="content">
          <div class="summary">
            <router-link :to="{ path: `/clients/${history.clientid}` }">{{history.firstname}} {{history.surname}}</router-link> paid ${{history.amount}} using cash for stand <router-link :to="{ path: `/stands/${history.standid}`}">{{history.standid}}</router-link> in {{history.township}}, {{history.city}}. Receipt number is <span class="ui mini orange label">{{history.receiptnum}}</span>
          </div>
          <div class="meta">
            <a :href="`mailto:${history.email}`"><i class="envelope icon"></i> Send Email</a>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import axios from '@/modules/axios'

  export default {
    data () {
      return {
        paymentHistory: [],
        alert: {
          show: false,
          type: 'info',
          message: ''
        },
        loading: () => {
          if (this.paymentHistory) {
            return false
          } else {
            return true
          }
        }
      }
    },
    created () {
      this.getPaymentsHistory()
    },
    methods: {
      getPaymentsHistory () {
        axios.get('/payments/history')
          .then(response => {
            this.paymentHistory = response.data.paymenthistory
            this.loading = false
          })
          .catch(error => {
            console.log(error)
            // error callback
            this.alert.show = true
            this.alert.type = 'error'
            this.alert.message = 'We are having trouble getting the payment history from the server. Please hit refresh or try again later.'

            this.loading = false
          })
      }
    }
  }
</script>

<style lang="css">
</style>
