const { body, param } = require('express-validator');

const registerValidator = [
  body('name').isString().isLength({ min: 2 }).withMessage('name is required'),
  body('email').isEmail().withMessage('valid email required'),
  body('password').isLength({ min: 6 }).withMessage('password min length 6'),
  body('role').optional().isIn(['user', 'organizer']).withMessage('role must be user or organizer'),
];

const loginValidator = [
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 }),
];

const eventCreateValidator = [
  body('title').isString().isLength({ min: 2 }),
  body('date').isISO8601().withMessage('date must be ISO8601'),
  body('capacity').isInt({ min: 1 }).withMessage('capacity must be positive'),
  body('location').optional().isString(),
  body('description').optional().isString(),
  body('tags').optional().isArray(),
];

const eventUpdateValidator = [
  body('title').optional().isString().isLength({ min: 2 }),
  body('date').optional().isISO8601(),
  body('capacity').optional().isInt({ min: 1 }),
  body('location').optional().isString(),
  body('description').optional().isString(),
  body('tags').optional().isArray(),
];

const bookingCreateValidator = [
  param('id').isString().withMessage('event id required'),
  body('tickets').optional().isInt({ min: 1 }).withMessage('tickets must be positive'),
];

module.exports = {
  registerValidator,
  loginValidator,
  eventCreateValidator,
  eventUpdateValidator,
  bookingCreateValidator,
};
