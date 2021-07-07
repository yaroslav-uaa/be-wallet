const app = require('../app')
const mongoDb = require('../model/mongoDb')
const createFolderIsNotExist = require('../helpers/create-folder')
require('dotenv').config()

const PORT = process.env.PORT || 3000
const UPLOAD_DIR = process.env.UPLOAD_DIR
const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS

mongoDb
  .then(() => {
    app.listen(PORT, async () => {
      await createFolderIsNotExist(UPLOAD_DIR)
      await createFolderIsNotExist(AVATAR_OF_USERS)
      console.log(`Server running. Use our API on port: ${PORT}`)
    })
  })
  .catch((e) => console.log(`Errore: ${e.message}`))
