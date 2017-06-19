import * as types from '@/store/mutation-types'

export default {
  [types.CLICK_ON_STAND] (state, payload) {
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
  },

  [types.RECIEVE_RESERVED_STANDS] (state, payload) {
    state.geojson.reservedStands = payload
  },

  [types.RECIEVE_SOLD_STANDS] (state, payload) {
    state.geojson.soldStands = payload
  },

  [types.CLEAR_ALL_STANDS] (state, payload) {
    for (let key in state.geojson) {
      state.geojson[key] = key === 'cities'
        ? state.geojson[key]
        : {}
    }
  },

  [types.NEW_STANDS_LIST] (state, payload) {
    state.standsList = payload
  },

  [types.NEW_LAYER] (state, payload) {
    state.layers.push(payload)
  },

  [types.TOGGLE_LAYER] (state, payload) {
    let layer = state.layers.find(layer => layer.id === payload)
    layer.active = !layer.active
  }

}
