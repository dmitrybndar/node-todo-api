const mongoose = require('mongoose');

const url = process.env.MONGO_URI;

mongoose.connect(
  url,
  { useNewUrlParser: true },
  err => {
    if (err) {
      return console.log(err);
    }
    console.log('Connected to DB');
  }
);

module.exports = mongoose;
