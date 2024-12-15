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
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../models/User");
const router = express_1.default.Router();
// Register
router.post('/register', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // Check if user already exists
        const existingUser = yield User_1.User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create new user
        const user = new User_1.User({
            username,
            password: hashedPassword
        });
        yield user.save();
        // Set session
        if (req.session) {
            req.session.userId = user._id.toString();
        }
        res.status(201).json({
            message: 'User created successfully',
            userId: user._id
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
})));
// Login
router.post('/login', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // Find user
        const user = yield User_1.User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Verify password
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Set session
        if (req.session) {
            req.session.userId = user._id.toString();
        }
        res.json({
            message: 'Logged in successfully',
            userId: user._id
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
})));
// Logout
router.post('/logout', ((req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Logout failed' });
            }
            res.json({ message: 'Logged out successfully' });
        });
    }
    else {
        res.json({ message: 'Already logged out' });
    }
}));
// Check auth status
router.get('/status', (req, res) => {
    if (req.session && req.session.userId) {
        res.json({
            authenticated: true,
            userId: req.session.userId
        });
    }
    else {
        res.json({ authenticated: false });
    }
});
exports.authRoutes = router;
