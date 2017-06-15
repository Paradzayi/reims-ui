export default{
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
