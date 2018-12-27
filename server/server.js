console.log('before');
const app = require('./app');
console.log('after');
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Started at port ${port}`);
});
