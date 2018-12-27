const request = require('supertest');
const { ObjectID } = require('mongodb');

const app = require('../app');
const Todo = require('../models/todo');

const todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo'
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo'
  }
];

beforeEach(done => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
});

describe('POST /todos', () => {
  test('it should create a new todo', async () => {
    const text = 'Test todo text';

    const res = await request(app)
      .post('/todos')
      .send({ text });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('text', text);

    Todo.find({ text })
      .then(todos => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toEqual(text);
      })
      .catch(e => console.log(e));
  });

  test("shouldn't create todo with invalid body data", async () => {
    const res = await request(app)
      .post('/todos')
      .send({ text: '' });

    expect(res.statusCode).toBe(400);

    Todo.find()
      .then(todos => {
        expect(todos.length).toBe(2);
      })
      .catch(e => console.log(e));
  });
});

describe('GET /todos', () => {
  test('it should get all todos', async () => {
    const res = await request(app).get('/todos');

    expect(res.statusCode).toBe(200);
    expect(res.body.todos.length).toBe(2);
  });
});

describe('GET /todos/:id', () => {
  test('it should return todo doc', async () => {
    const res = await request(app).get(`/todos/${todos[0]._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.todo.text).toBe(todos[0].text);
  });

  test('it should return 400', async () => {
    const res = await request(app).get(`/todos/123`);

    expect(res.statusCode).toBe(400);
  });

  test('it should return 404 if todo not found', async () => {
    const res = await request(app).get(
      `/todos/${new ObjectID().toHexString()}`
    );

    expect(res.statusCode).toBe(404);
  });
});
