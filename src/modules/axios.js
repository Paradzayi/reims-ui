const axios = require('axios')

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api'
    : 'https://reims-app.herokuapp.com/api'
})

module.exports = instance
