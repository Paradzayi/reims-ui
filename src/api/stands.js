import axios from '../modules/axios'

/*
  Get the cities in which stands are located
  in geojson format.
*/
function getBaseLayer () {
  return new Promise((resolve, reject) => {
    axios.get('/cities')
      .then(res => {
        resolve(res.data.data[0])
      })
      .catch(reject)
  })
}

function getAllStands () {
  return new Promise((resolve, reject) => {
    axios.get('/stands?map=true')
      .then(res => {
        resolve(res.data.data[0])
      })
      .catch(reject)
  })
}

function getAvailableStands () {
  return new Promise((resolve, reject) => {
    axios.get('/stands/available?map=true')
      .then(res => {
        resolve(res.data.availablestandsmap[0])
      })
      .catch(reject)
  })
}

function getReservedStands () {
  return new Promise((resolve, reject) => {
    axios.get('/stands/reservations?map=true')
      .then(res => {
        resolve(res.data.reservedstandsmap[0])
      })
      .catch(reject)
  })
}

function getSoldStands () {
  return new Promise((resolve, reject) => {
    axios.get('/stands/sold?map=true')
      .then(res => {
        resolve(res.data.soldstandsmap[0])
      })
      .catch(reject)
  })
}

export default {
  getBaseLayer,
  getAllStands,
  getAvailableStands,
  getReservedStands,
  getSoldStands
}
