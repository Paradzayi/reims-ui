<template>
  <div class="ui container basic segment">
    <div class="ui divided header">
      Sold Stands
    </div>
    <!-- search for stand -->
    <div class="ui right action input">
      <input placeholder="Search stand">
      <button class="ui primary icon button">
        <i class="search icon"></i>
      </button>
    </div>

    <!-- create new stand -->
    <router-link to="/create/stand" class="ui right floated labeled primary icon button">
      <i class="add icon"></i>
       Create new stand
     </router-link>

     <!-- the results table -->
    <table class="ui fluid table">
      <thead>
        <tr>
          <th>STAND ID</th>
          <th>TOWNSHIP</th>
          <th>CITY</th>
          <th>RESERVATION DATE</th>
          <th>EXPIRY DATE</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="stands" v-for="stand in stands">
            <td>
              <a @click="selectStand(stand)"><i class="home icon"></i> {{stand.standid}}</a>
            </td>
            <td>{{stand.township}}</td>
            <td>{{stand.city}}</td>
            <td>
              <router-link :to="{path: `/clients/${stand.clientid}`}">
               <i class="user outline icon"></i>
               {{stand.firstname}} {{stand.surname}}
              </router-link>
            </td>
            <td><a :href="`mailto:${stand.email}`"><i class="envelope icon"></i>{{stand.email}}</a></td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="10">
            <div v-if="!stands" class="ui fluid">
              <h5 style="color:orange" v-if="!loading && alert.show==false" class="huge text-muted"><i class="frown icon"></i> No sold stands found.</h5>
              <h5 style="color:lightBlue"v-if="loading" class="ui loading fluid blue basic segment">Loading...</h5>
              <div :class="{ui: true, warning : alert.type == 'warning' ?  true : false, error: alert.type == 'error' ?  true : false, message:true }" v-if="alert.show">

                <p><i class="warning sign icon"></i>{{alert.message}}</p>
              </div>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
  import axios from 'axios'
  import config from '@/modules/config'
  let ApiConfig = config.api

  export default {
    name: 'ViewClients',

    data () {
      return {
        stands: null,
        alert: {
          show: false,
          type: 'info',
          message: ''
        },
        searchString: '',
        loading: () => {
          if (this.stands) {
            return false
          } else {
            return true
          }
        }
      }
    },
    created () {
      // GET /someUrl
      axios.get(ApiConfig.baseUrl + '/api/stands/sold')
        .then(response => {
          // get body data
          this.stands = response.data.soldstands
          this.loading = false
          console.log(this.stands)
        })
        .catch(response => {
          // error callback
          this.alert.show = true
          this.alert.type = 'error'
          this.alert.message = 'We are having trouble getting the stands from the server. Please hit refresh or try again later.'

          this.loading = false
        })
    },

    methods: {
      selectStand (stand) {
        this.$router.push({path: `/stands/${stand.standid}`})
      }
    }
  }
</script>

<style lang="css">
</style>
