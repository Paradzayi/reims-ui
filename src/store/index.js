import Vue from 'vue'
import Vuex from 'vuex'
import stands from './modules/stands'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    stands
  }
})

export default store
