import * as types from '@/store/mutation-types'

export default {
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
