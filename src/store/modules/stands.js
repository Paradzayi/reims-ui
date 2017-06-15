import api from '@/api'
import * as types from '@/store/mutation-types'

const state = {
  clickedStand: {
    standid: null,
    status: null
  },

  geojson: {
    cities: {},
    allStands: {},
    availableStands: {}
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
  },

  getAllStands ({ commit }) {
    api.stands.getAllStands()
      .then(allStands => {
        commit(types.RECIEVE_ALL_STANDS, allStands)
      })
  },

  getAvailableStands ({ commit }) {
    api.stands.getAvailableStands()
      .then(availableStands => {
        commit(types.RECIEVE_AVAILABLE_STANDS, availableStands)
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
  },

  [types.RECIEVE_ALL_STANDS] (state, payload) {
    state.geojson.allStands = payload
  },

  [types.RECIEVE_AVAILABLE_STANDS] (state, payload) {
    state.geojson.availableStands = payload
  }
}

const getters = {
  cities (state) {
    return state.geojson.cities
  },

  allStands (state) {
    return state.geojson.allStands
  },

  availableStands (state) {
    return state.geojson.availableStands
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
