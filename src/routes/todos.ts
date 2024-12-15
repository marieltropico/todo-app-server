import { Router, Response } from 'express';
import type { RequestHandler } from 'express';  
import mongoose from 'mongoose';
import { Todo } from '../models/Todo';
import { AuthRequest } from '../types';
import { validateRequest } from '../middleware/validateRequest';
import { todoValidation } from '../middleware/validation';

const router = Router();

// Get all todos for user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const todos = await Todo.find({ 
        userId: req.session?.userId 
    }).sort({ createdAt: -1 });
    
    res.json(todos);
  } catch (error) {
      console.error('Fetch todos error:', error);
      res.status(500).json({ error: 'Failed to fetch todos' });
  }
}) as RequestHandler;

// Create new todo
router.post('/', 
  validateRequest(todoValidation.create),
  async (req: AuthRequest, res: Response) => {
    try {
      const { title } = req.body;
      const todo = new Todo({
        userId: req.session?.userId,
        title: title.trim(),
        completed: false
      });

      await todo.save();
      res.status(201).json(todo);
    } catch (error) {
      console.error('Create todo error:', error);
      res.status(500).json({ error: 'Failed to create todo' });
    }
  }
) as RequestHandler;

// Update todo
router.put('/:id', validateRequest(todoValidation.update), (async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }

    const { title, completed } = req.body;

    const todo = await Todo.findOneAndUpdate(
        { 
            _id: id, 
            userId: req.session?.userId 
        },
        { 
            ...(title && { title: title.trim() }),
            ...(completed !== undefined && { completed })
        },
        { 
            new: true,
            runValidators: true
        }
    );

    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
}) as RequestHandler);

// Delete todo
router.delete('/:id', (async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({ 
        _id: id, 
        userId: req.session?.userId 
    });

    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
}) as RequestHandler);

// Get single todo
router.get('/:id', (async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOne({ 
        _id: id, 
        userId: req.session?.userId 
    });

    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Fetch todo error:', error);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
}) as RequestHandler);

export const todoRoutes = router;