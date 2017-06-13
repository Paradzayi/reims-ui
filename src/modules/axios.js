const axios = require('axios')

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://reims-app.herokuapp.com/api'
    : 'http://localhost:3000/api'
})

module.exports = instance
