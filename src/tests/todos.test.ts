import request from 'supertest';
import { describe, it, beforeEach, expect, beforeAll } from '@jest/globals';
import { app } from '../app';
import { Todo } from '../models/Todo';
import { TodoDocument } from '../types';

describe('Todo Routes', () => {
  let authCookie: string[];
  let userId: string;
  let testTodoId: string;

  beforeAll(async () => {
    // Create test user and login
    const register = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'todotest',
        password: 'password123'
      });
    userId = register.body.userId;
    
    const login = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'todotest',
        password: 'password123'
      });

    const cookies = login.get('Set-Cookie');
    if (!cookies) {
      throw new Error('No cookies returned from login');
    }
    authCookie = cookies;
  });

  beforeEach(async () => {
    await Todo.deleteMany({});
    // Create a test todo for GET, PUT, DELETE operations
    const todo = await Todo.create({
      title: 'Test todo',
      userId,
      completed: false
    }) as TodoDocument;

    testTodoId = todo._id.toString();
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const response = await request(app)
        .post('/api/todos')
        .set('Cookie', authCookie)
        .send({
          title: 'Test todo'
        });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Test todo');
      expect(response.body.userId).toBe(userId);
    });

    it('should not create todo without title', async () => {
      const response = await request(app)
        .post('/api/todos')
        .set('Cookie', authCookie)
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/todos', () => {
    it('should get all todos for user', async () => {
      const response = await request(app)
        .get('/api/todos')
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe('Test todo');
    });
  });

  describe('GET /api/todos/:id', () => {
    it('should get a single todo', async () => {
      const response = await request(app)
        .get(`/api/todos/${testTodoId}`)
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Test todo');
      expect(response.body._id).toBe(testTodoId);
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .get('/api/todos/654321654321654321654321')
        .set('Cookie', authCookie);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update a todo', async () => {
      const response = await request(app)
        .put(`/api/todos/${testTodoId}`)
        .set('Cookie', authCookie)
        .send({
          title: 'Updated todo',
          completed: true
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated todo');
      expect(response.body.completed).toBe(true);
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .put('/api/todos/654321654321654321654321')
        .set('Cookie', authCookie)
        .send({
          title: 'Updated todo'
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete a todo', async () => {
      const response = await request(app)
        .delete(`/api/todos/${testTodoId}`)
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      
      // Verify todo was deleted
      const todos = await Todo.find({ userId });
      expect(todos.length).toBe(0);
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .delete('/api/todos/654321654321654321654321')
        .set('Cookie', authCookie);

      expect(response.status).toBe(404);
    });
  });
});
