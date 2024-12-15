"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoValidation = void 0;
const express_validator_1 = require("express-validator");
exports.todoValidation = {
    create: [
        (0, express_validator_1.body)('title').trim().notEmpty().withMessage('Title is required')
            .isString().withMessage('Title must be a string')
    ],
    update: [
        (0, express_validator_1.body)('title').optional().trim().notEmpty().withMessage('Title cannot be empty')
            .isString().withMessage('Title must be a string'),
        (0, express_validator_1.body)('completed').optional().isBoolean().withMessage('Completed must be a boolean')
    ]
};
