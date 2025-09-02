const express = require('express');
const healthController = require('../controllers/health');
const authController = require('../controllers/auth');
const usersController = require('../controllers/users');
const eventsController = require('../controllers/events');
const bookingsController = require('../controllers/bookings');
const organizerController = require('../controllers/organizer');
const { authenticate, authorize } = require('../middleware/auth');
const {
  registerValidator,
  loginValidator,
  eventCreateValidator,
  eventUpdateValidator,
  bookingCreateValidator,
} = require('../middleware/validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Health
 *   - name: Auth
 *   - name: Users
 *   - name: Events
 *   - name: Bookings
 *   - name: Organizer
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service health check passed
 */
router.get('/', healthController.check.bind(healthController));

/**
 * @swagger
 * /openapi.json:
 *   get:
 *     summary: Download OpenAPI spec
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: The OpenAPI schema in JSON
 */
router.get('/openapi.json', (req, res) => {
  const spec = require('../../swagger');
  res.json(spec);
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name,email,password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *               role: { type: string, enum: [user, organizer] }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Validation error }
 *       409: { description: Email already in use }
 */
router.post('/auth/register', registerValidator, authController.register.bind(authController));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email,password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       200: { description: OK }
 *       400: { description: Validation error }
 *       401: { description: Invalid credentials }
 */
router.post('/auth/login', loginValidator, authController.login.bind(authController));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: OK }
 *       401: { description: Unauthorized }
 */
router.get('/auth/me', authenticate, authController.me.bind(authController));

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get my profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/users/me', authenticate, usersController.getMe.bind(usersController));

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update my profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/users/me', authenticate, usersController.updateMe.bind(usersController));

/**
 * @swagger
 * /users/me/bookings:
 *   get:
 *     summary: List my bookings
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/users/me/bookings', authenticate, usersController.myBookings.bind(usersController));

/**
 * @swagger
 * /events:
 *   get:
 *     summary: List events
 *     tags: [Events]
 */
router.get('/events', eventsController.list.bind(eventsController));

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event by id
 *     tags: [Events]
 */
router.get('/events/:id', eventsController.get.bind(eventsController));

/**
 * @swagger
 * /events/{id}/book:
 *   post:
 *     summary: Create a booking for an event
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.post('/events/:id/book', authenticate, bookingCreateValidator, bookingsController.create.bind(bookingsController));

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Cancel my booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/bookings/:id', authenticate, bookingsController.cancel.bind(bookingsController));

/**
 * @swagger
 * /organizer/events:
 *   post:
 *     summary: Create event (organizer)
 *     tags: [Organizer]
 *     security:
 *       - bearerAuth: []
 */
router.post('/organizer/events', authenticate, authorize(['organizer']), eventCreateValidator, eventsController.create.bind(eventsController));

/**
 * @swagger
 * /organizer/events/{id}:
 *   patch:
 *     summary: Update event (organizer)
 *     tags: [Organizer]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/organizer/events/:id', authenticate, authorize(['organizer']), eventUpdateValidator, eventsController.update.bind(eventsController));

/**
 * @swagger
 * /organizer/events/{id}:
 *   delete:
 *     summary: Delete event (organizer)
 *     tags: [Organizer]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/organizer/events/:id', authenticate, authorize(['organizer']), eventsController.delete.bind(eventsController));

/**
 * @swagger
 * /organizer/events/{id}/bookings:
 *   get:
 *     summary: List bookings for my event
 *     tags: [Organizer]
 *     security:
 *       - bearerAuth: []
 */
router.get('/organizer/events/:id/bookings', authenticate, authorize(['organizer']), bookingsController.listForEvent.bind(bookingsController));

/**
 * @swagger
 * /organizer/stats:
 *   get:
 *     summary: Organizer stats
 *     tags: [Organizer]
 *     security:
 *       - bearerAuth: []
 */
router.get('/organizer/stats', authenticate, authorize(['organizer']), organizerController.stats.bind(organizerController));

module.exports = router;
