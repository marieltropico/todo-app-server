# Todo API Server

A secure and scalable RESTful API for managing todos with user authentication, built with TypeScript and Express.js.

## Features

- User authentication with session management
- CRUD operations for todos
- Input validation
- TypeScript support
- Comprehensive test coverage
- MongoDB integration

## Tech Stack

- Node.js/Express.js
- TypeScript
- MongoDB/Mongoose
- Jest/Supertest
- Express Validator
- Express Session

## Prerequisites

- Node.js (v14+)
- MongoDB (v4.4+)
- TypeScript (v4.5+)

## Project Setup

1. Clone the repository and install dependencies:
```bash
git clone https://github.com/your-repo/todo-api-server.git
cd server
npm install
```

2. Create `.env` file in root directory:
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo-app
SESSION_SECRET=your-secret-key
```
3. Start development server:
```bash
npm run dev
```

4. Run tests:
```bash
npm test
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run test`: Run tests
- `npm run lint`: Run linting
- `npm run build`: Build production server
- `npm start`: Start production server


## API Routes

### Authentication
- POST /auth/register: Register a new user
- POST /auth/login: Login user
- POST /auth/logout: Logout user

### Todos
- GET /todos: Get all todos for authenticated user
- POST /todos: Create a new todo for authenticated user
- PUT /todos/:id: Update a todo for authenticated user
- DELETE /todos/:id: Delete a todo for authenticated user


## Project Structure
src/
├── config/ # Database configuration
├── middleware/ # Express middlewares
├── models/ # Mongoose models
├── routes/ # Route handlers
├── tests/ # Test files
├── types/ # TypeScript interfaces
└── index.ts # Entry point


## Testing

The project uses Jest and Supertest for API testing. Tests include:

- Authentication: Register, Login, Logout
- Todo CRUD operations
- Input validation
- Error handling
