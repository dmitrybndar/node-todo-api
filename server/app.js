const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('./db/mongoose');
const Todo = require('./models/todo');
const User = require('./models/user');

const app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text
  });

  todo
    .save()
    .then(doc => res.send(doc))
    .catch(e => res.status(400).send(e));
});

app.get('/todos', (req, res) => {
  Todo.find()
    .then(todos => res.send({ todos }))
    .catch(e => res.status(400).send(e));
});

app.get('/todos/:id', (req, res) => {
  Todo.findById(req.params.id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch(e => res.status(400).send(e));
});

module.exports = app;