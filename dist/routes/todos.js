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
exports.todoRoutes = void 0;
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const Todo_1 = require("../models/Todo");
const validateRequest_1 = require("../middleware/validateRequest");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
// Get all todos for user
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const todos = yield Todo_1.Todo.find({
            userId: (_a = req.session) === null || _a === void 0 ? void 0 : _a.userId
        }).sort({ createdAt: -1 });
        res.json(todos);
    }
    catch (error) {
        console.error('Fetch todos error:', error);
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
}));
// Create new todo
router.post('/', (0, validateRequest_1.validateRequest)(validation_1.todoValidation.create), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title } = req.body;
        const todo = new Todo_1.Todo({
            userId: (_a = req.session) === null || _a === void 0 ? void 0 : _a.userId,
            title: title.trim(),
            completed: false
        });
        yield todo.save();
        res.status(201).json(todo);
    }
    catch (error) {
        console.error('Create todo error:', error);
        res.status(500).json({ error: 'Failed to create todo' });
    }
}));
// Update todo
router.put('/:id', (0, validateRequest_1.validateRequest)(validation_1.todoValidation.update), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid todo ID' });
        }
        const { title, completed } = req.body;
        const todo = yield Todo_1.Todo.findOneAndUpdate({
            _id: id,
            userId: (_a = req.session) === null || _a === void 0 ? void 0 : _a.userId
        }, Object.assign(Object.assign({}, (title && { title: title.trim() })), (completed !== undefined && { completed })), {
            new: true,
            runValidators: true
        });
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(todo);
    }
    catch (error) {
        console.error('Update todo error:', error);
        res.status(500).json({ error: 'Failed to update todo' });
    }
})));
// Delete todo
router.delete('/:id', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const todo = yield Todo_1.Todo.findOneAndDelete({
            _id: id,
            userId: (_a = req.session) === null || _a === void 0 ? void 0 : _a.userId
        });
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted successfully' });
    }
    catch (error) {
        console.error('Delete todo error:', error);
        res.status(500).json({ error: 'Failed to delete todo' });
    }
})));
// Get single todo
router.get('/:id', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const todo = yield Todo_1.Todo.findOne({
            _id: id,
            userId: (_a = req.session) === null || _a === void 0 ? void 0 : _a.userId
        });
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(todo);
    }
    catch (error) {
        console.error('Fetch todo error:', error);
        res.status(500).json({ error: 'Failed to fetch todo' });
    }
})));
exports.todoRoutes = router;
