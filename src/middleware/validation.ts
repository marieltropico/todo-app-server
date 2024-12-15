import { body } from 'express-validator';

export const todoValidation = {
  create: [
    body('title').trim().notEmpty().withMessage('Title is required')
      .isString().withMessage('Title must be a string')
  ],
  
  update: [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty')
      .isString().withMessage('Title must be a string'),
    body('completed').optional().isBoolean().withMessage('Completed must be a boolean')
  ]
};