const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event Booking API',
      version: '1.0.0',
      description: 'REST API for user, event, booking management with organizer features.',
    },
    tags: [
      { name: 'Health', description: 'Health and docs' },
      { name: 'Auth', description: 'Registration, login, and user identity' },
      { name: 'Users', description: 'User profile and bookings' },
      { name: 'Events', description: 'Browse and view events' },
      { name: 'Bookings', description: 'Create and manage bookings' },
      { name: 'Organizer', description: 'Organizer event management and stats' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
