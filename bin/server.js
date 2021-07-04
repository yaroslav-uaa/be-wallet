const app = require('../app')
const mongoDb = require('../model/mongoDb')
require('dotenv').config()

const PORT = process.env.PORT || 3000

mongoDb.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running. Use our API on port: ${PORT}`)
  })
})
