const mongoose = require('mongoose')

const connectDB = (url) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Database connection successful')
  }).catch((err) => {
    console.error('Database connection error')
  })
}

module.exports = connectDB
