"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const globals_1 = require("@jest/globals");
const app_1 = require("../app");
const Todo_1 = require("../models/Todo");
(0, globals_1.describe)('Todo Routes', () => {
    let authCookie;
    let userId;
    let testTodoId;
    (0, globals_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create test user and login
        const register = yield (0, supertest_1.default)(app_1.app)
            .post('/api/auth/register')
            .send({
            username: 'todotest',
            password: 'password123'
        });
        userId = register.body.userId;
        const login = yield (0, supertest_1.default)(app_1.app)
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
    }));
    (0, globals_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Todo_1.Todo.deleteMany({});
        // Create a test todo for GET, PUT, DELETE operations
        const todo = yield Todo_1.Todo.create({
            title: 'Test todo',
            userId,
            completed: false
        });
        testTodoId = todo._id.toString();
    }));
    (0, globals_1.describe)('POST /api/todos', () => {
        (0, globals_1.it)('should create a new todo', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/todos')
                .set('Cookie', authCookie)
                .send({
                title: 'Test todo'
            });
            (0, globals_1.expect)(response.status).toBe(201);
            (0, globals_1.expect)(response.body.title).toBe('Test todo');
            (0, globals_1.expect)(response.body.userId).toBe(userId);
        }));
        (0, globals_1.it)('should not create todo without title', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/todos')
                .set('Cookie', authCookie)
                .send({});
            (0, globals_1.expect)(response.status).toBe(400);
        }));
    });
    (0, globals_1.describe)('GET /api/todos', () => {
        (0, globals_1.it)('should get all todos for user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .get('/api/todos')
                .set('Cookie', authCookie);
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(Array.isArray(response.body)).toBe(true);
            (0, globals_1.expect)(response.body.length).toBe(1);
            (0, globals_1.expect)(response.body[0].title).toBe('Test todo');
        }));
    });
    (0, globals_1.describe)('GET /api/todos/:id', () => {
        (0, globals_1.it)('should get a single todo', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .get(`/api/todos/${testTodoId}`)
                .set('Cookie', authCookie);
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(response.body.title).toBe('Test todo');
            (0, globals_1.expect)(response.body._id).toBe(testTodoId);
        }));
        (0, globals_1.it)('should return 404 for non-existent todo', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .get('/api/todos/654321654321654321654321')
                .set('Cookie', authCookie);
            (0, globals_1.expect)(response.status).toBe(404);
        }));
    });
    (0, globals_1.describe)('PUT /api/todos/:id', () => {
        (0, globals_1.it)('should update a todo', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .put(`/api/todos/${testTodoId}`)
                .set('Cookie', authCookie)
                .send({
                title: 'Updated todo',
                completed: true
            });
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(response.body.title).toBe('Updated todo');
            (0, globals_1.expect)(response.body.completed).toBe(true);
        }));
        (0, globals_1.it)('should return 404 for non-existent todo', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .put('/api/todos/654321654321654321654321')
                .set('Cookie', authCookie)
                .send({
                title: 'Updated todo'
            });
            (0, globals_1.expect)(response.status).toBe(404);
        }));
    });
    (0, globals_1.describe)('DELETE /api/todos/:id', () => {
        (0, globals_1.it)('should delete a todo', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .delete(`/api/todos/${testTodoId}`)
                .set('Cookie', authCookie);
            (0, globals_1.expect)(response.status).toBe(200);
            // Verify todo was deleted
            const todos = yield Todo_1.Todo.find({ userId });
            (0, globals_1.expect)(todos.length).toBe(0);
        }));
        (0, globals_1.it)('should return 404 for non-existent todo', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .delete('/api/todos/654321654321654321654321')
                .set('Cookie', authCookie);
            (0, globals_1.expect)(response.status).toBe(404);
        }));
    });
});
