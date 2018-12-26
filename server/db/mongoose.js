const mongoose = require('mongoose');

const url = process.env.MONGO_URI || 'mongodb://localhost:27017/TodoApp';

mongoose.connect(
  url,
  { useNewUrlParser: true },
  () => {
    console.log('Connected to DB');
  }
);

module.exports = mongoose;
