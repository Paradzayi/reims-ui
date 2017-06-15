import api from '@/api'
import * as types from '@/store/mutation-types'

const state = {
  clickedStand: {
    standid: null,
    status: null
  },

  geojson: {
    cities: {}
  }
}

const actions = {
  getBaseLayer ({ commit, state }) {
    api.stands.getBaseLayer()
      .then(cities => {
        commit(types.RECIEVE_CITIES, cities)
      })
      .catch(error => {
        console.log(error)
      })
  }
}

const mutations = {
  clickOnStand (state, payload) {
    if (payload.standid && payload.status) {
      state.clickedStand = payload
    }
  },

  [types.RECIEVE_CITIES] (state, payload) {
    state.geojson.cities = payload
  }
}

const getters = {
  cities (state) {
    return state.geojson.cities
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
