const http = require('http')

const PORT = process.env.PORT || 5001

const requestListener = (req, res) => {
  console.log({ req, res })
}

const app = http.createServer(PORT, requestListener)