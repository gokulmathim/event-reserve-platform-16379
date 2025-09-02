const store = require('./models/store');

// Seed example data only for development convenience
function seed() {
  if (process.env.NODE_ENV === 'development' && store.events.length === 0) {
    const organizer = store.createUser({
      name: 'Demo Organizer',
      email: 'organizer@example.com',
      passwordHash: '$2a$10$CSTm4yIYV4rIYtGfB0v3gOd6g5wNQJz0l3Y7w6tT8lDqGkSx9xE0W', // "password" (not used for login)
      role: 'organizer'
    });
    store.createEvent({
      title: 'Sample Music Concert',
      description: 'An amazing night of music.',
      date: new Date(Date.now() + 86400000).toISOString(),
      location: 'City Hall',
      capacity: 100,
      tags: ['music', 'concert'],
      organizerId: organizer.id,
    });
  }
}

module.exports = { seed };
