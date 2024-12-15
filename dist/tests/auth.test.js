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
const User_1 = require("../models/User");
(0, globals_1.describe)('Auth Routes', () => {
    (0, globals_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield User_1.User.deleteMany({});
    }));
    (0, globals_1.describe)('POST /api/auth/register', () => {
        (0, globals_1.it)('should register a new user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/auth/register')
                .send({
                username: 'testuser',
                password: 'password123'
            });
            (0, globals_1.expect)(response.status).toBe(201);
            (0, globals_1.expect)(response.body).toHaveProperty('userId');
        }));
    });
    (0, globals_1.describe)('POST /api/auth/login', () => {
        (0, globals_1.it)('should login existing user', () => __awaiter(void 0, void 0, void 0, function* () {
            // First register
            yield (0, supertest_1.default)(app_1.app)
                .post('/api/auth/register')
                .send({
                username: 'testuser',
                password: 'password123'
            });
            // Then login
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/auth/login')
                .send({
                username: 'testuser',
                password: 'password123'
            });
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(response.body).toHaveProperty('userId');
        }));
    });
});
