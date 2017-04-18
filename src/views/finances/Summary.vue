<template>
  <div class="ui container">

    <h5 style="color:lightBlue"v-if="loading" class="ui loading fluid orange basic segment">Loading...</h5>

    <div :class="{ui: true, warning : alert.type == 'warning' ?  true : false, error: alert.type == 'error' ?  true : false, message:true }" v-if="alert.show">
      <p><i class="warning sign icon"></i>{{alert.message}}</p>
    </div>

    <!--Show only three cards at a time -->
    <div class="ui three cards">

      <!-- Show the summary of a stand in a card -->
      <div class="ui card" v-for="summary in paymentSummary">
        <div class="ui center aligned image">
          <div class="ui orange icon header">
            <router-link :to="{ path: `/stands/${summary.standid}` }">
              <i class="orange home outline icon"></i>
              Stand {{summary.standid}}
            </router-link>

          </div>
        </div>
        <div class="content">
          <div class="description">
            <table class="ui fluid orange table">
              <tbody>
                <tr>
                  <td>
                    <i class="marker icon"></i>
                    Location
                  </td>
                  <td>
                    {{summary.township}}, {{summary.city}}
                  </td>
                </tr>

                <tr>
                  <td>
                    <i class="dollar icon"></i>
                    Price
                  </td>
                  <td>
                    ${{summary.price}}
                  </td>
                </tr>

                <tr>
                  <td>
                    <i class="dollar icon"></i>
                    Total Paid
                  </td>
                  <td>
                    ${{summary.totalpayment}}
                  </td>
                </tr>

                <tr class="error">
                  <td><i class="hourglass half icon"></i>Balance</td>
                  <td>${{summary.price - summary.totalpayment}}</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import config from '@/modules/config'
let ApiConfig = config.api

export default {
  data () {
    return {
      paymentSummary: [],
      alert: {
        show: false,
        type: 'info',
        message: ''
      },
      loading: () => {
        if (this.paymentSummary.length) {
          return false
        } else {
          return true
        }
      }

    }
  },
  methods: {
    getPaymentSummary () {
      axios.get(ApiConfig.baseUrl + '/api/payments/summary')
        .then(response => {
          this.paymentSummary = response.data.paymentssummary
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          // error callback
          this.alert.show = true
          this.alert.type = 'error'
          this.alert.message = 'We are having trouble getting the payment summary from the server. Please hit refresh or try again later.'

          this.loading = false
        })
    }
  },
  created () {
    this.getPaymentSummary()
  }
}
</script>

<style lang="css">
</style>
