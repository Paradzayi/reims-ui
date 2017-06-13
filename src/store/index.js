import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    clickedStand: {
      standid: null,
      status: null
    }
  },

  mutations: {
    clickOnStand (state, payload) {
      if (payload.standid && payload.status) {
        state.clickedStand = payload
      }
    }
  }
})

export default store
