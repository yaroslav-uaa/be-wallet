const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wallet API',
      version: '1.0.0',
      description: 'A simple Express Wallet API build with MongoDB',
    },
    servers: [
      {
        url: 'http://localhost:4040/api',
      },
    ],
  },
  apis: ['./routes/api/users/index.js', './routes/api/transactions/index.js'],
}
module.exports = options
