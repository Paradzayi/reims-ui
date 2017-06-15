export default{
  cities: state => state.geojson.cities,

  allStands: state => state.geojson.allStands,

  availableStands: state => state.geojson.availableStands,

  reservedStands: state => state.geojson.reservedStands,

  soldStands: state => state.geojson.soldStands,

  standsList: state => state.standsList
}
