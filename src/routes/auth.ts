import express, { Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { AuthRequest } from '../types';

const router = express.Router();

// Register
router.post('/register', (async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      password: hashedPassword
    });

    await user.save();

    // Set session
    if (req.session) {
      (req.session as any).userId = user._id.toString();
    }

    res.status(201).json({
      message: 'User created successfully',
      userId: user._id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}) as express.RequestHandler);

// Login
router.post('/login', (async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Set session
    if (req.session) {
      (req.session as any).userId = user._id.toString();
    }

    res.json({ 
        message: 'Logged in successfully',
        userId: user._id 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}) as express.RequestHandler);

// Logout
router.post('/logout', ((req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
  } else {
    res.json({ message: 'Already logged out' });
  }
}) as express.RequestHandler);

// Check auth status
router.get('/status', (req: AuthRequest, res: Response) => {
  if (req.session && req.session.userId) {
    res.json({ 
        authenticated: true, 
        userId: req.session.userId 
    });
  } else {
    res.json({ authenticated: false });
  }
});

export const authRoutes = router;