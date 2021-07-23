const cloudinary = require('cloudinary').v2
const { promisify } = require('util')
require('dotenv').config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_ClOUDINARY,
  api_secret: process.env.API_SECRET_ClOUDINARY,
})

const uploadCloud = promisify(cloudinary.uploader.upload)

class UploadService {
  async saveAvatar(pathFile, oldIdCloudAvatar) {
    const {
      public_id: idCloudAvatar,
      secure_url: avatarURL,
    } = await uploadCloud(pathFile, {
      public_id: oldIdCloudAvatar?.replace('avatarCloud/', ''),
      folder: 'avatarCloud',
      transformation: { width: 250, height: 250, crop: 'pad' },
    })
    return { idCloudAvatar, avatarURL }
  }
}

module.exports = UploadService
