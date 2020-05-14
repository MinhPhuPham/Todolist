const http = require('http')
const router = require('./router')
const finalhandler = require('finalhandler')
const server = http.createServer((req, res) => {
  router(req, res, finalhandler(req, res))
})

module.exports = server
