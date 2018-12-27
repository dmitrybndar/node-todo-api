const request = require('supertest');
const { ObjectID } = require('mongodb');

const app = require('../app');
const Todo = require('../models/todo');

const todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo',
    completed: false,
    completedAt: null
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 12342542
  }
];

beforeEach(() => {
  return Todo.deleteMany({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => {});
});

describe('POST /todos', () => {
  test('it should create a new todo', () => {
    const text = 'Test todo text';

    return request(app)
      .post('/todos')
      .send({ text })
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('text', text);

        return Todo.find({ text });
      })
      .then(todos => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toEqual(text);
      });
  });

  test("shouldn't create todo with invalid body data", () => {
    return request(app)
      .post('/todos')
      .send({ text: '' })
      .then(res => {
        expect(res.statusCode).toBe(400);

        return Todo.find();
      })
      .then(todos => {
        expect(todos.length).toBe(2);
      })
      .catch(e => console.log(e));
  });
});

describe('GET /todos', () => {
  test('it should get all todos', () => {
    return request(app)
      .get('/todos')
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.body.todos.length).toBe(2);
      });
  });
});

describe('GET /todos/:id', () => {
  test('it should return todo doc', () => {
    return request(app)
      .get(`/todos/${todos[0]._id}`)
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.body.todo.text).toBe(todos[0].text);
      });
  });

  test('it should return 400', () => {
    return request(app)
      .get(`/todos/123`)
      .then(res => {
        expect(res.statusCode).toBe(400);
      });
  });

  test('it should return 404 if todo not found', () => {
    return request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .then(res => {
        expect(res.statusCode).toBe(404);
      });
  });
});

describe('DELETE /todos/:id', () => {
  test('it should remove a todo', () => {
    return request(app)
      .delete(`/todos/${todos[0]._id}`)
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.body.todo.text).toBe(todos[0].text);
        return Todo.findById(todos[0]._id);
      })
      .then(todo => {
        expect(todo).toBeNull();
      });
  });

  test('it should return 404 if todo not found', () => {
    return request(app)
      .delete(`/todos/${new ObjectID()}`)
      .then(res => {
        expect(res.statusCode).toBe(404);
      });
  });

  test('it should return 400 if object ID is invalid', () => {
    return request(app)
      .delete(`/todos/${new ObjectID()}`)
      .then(res => {
        expect(res.statusCode).toBe(404);
      });
  });
});

describe('PUT /todos/:id', () => {
  test('it should update a todo text', () => {
    const newText = 'New test text';

    return request(app)
      .put(`/todos/${todos[0]._id}`)
      .send({ text: newText, completed: true })
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.body.todo.text).toBe(newText);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toEqual(expect.any(Number));
        return Todo.findById(todos[0]._id);
      })
      .then(todo => {
        expect(todo.text).toBe(newText);
        expect(todo.completed).toBe(true);
        expect(todo.completedAt).toEqual(expect.any(Number));
      });
  });

  test('it should clear completedAt when todo is not completed', () => {
    return request(app)
      .put(`/todos/${todos[1]._id}`)
      .send({ completed: false })
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeNull();
        return Todo.findById(todos[1]._id);
      })
      .then(todo => {
        expect(todo.completed).toBe(false);
        expect(todo.completedAt).toBeNull();
      });
  });

  test('it should return 404 if todo not found', () => {
    return request(app)
      .put(`/todos/${new ObjectID()}`)
      .send({ text: '123' })
      .then(res => {
        expect(res.statusCode).toBe(404);
      });
  });

  test('it should return 400 if object ID is invalid', () => {
    return request(app)
      .put(`/todos/123`)
      .send({ text: '123' })
      .then(res => {
        expect(res.statusCode).toBe(400);
      });
  });
});
