const store = require('../models/store');

class EventsService {
  // PUBLIC_INTERFACE
  list(filter) {
    return store.listEvents(filter);
  }

  // PUBLIC_INTERFACE
  getById(id) {
    return store.findEventById(id);
  }

  // PUBLIC_INTERFACE
  create(organizerId, payload) {
    const { title, description, date, location, capacity, tags } = payload;
    if (!title || !date || !capacity) {
      const err = new Error('Missing required fields: title, date, capacity');
      err.status = 400;
      throw err;
    }
    const cap = Number(capacity);
    if (Number.isNaN(cap) || cap <= 0) {
      const err = new Error('capacity must be a positive number');
      err.status = 400;
      throw err;
    }
    return store.createEvent({
      title,
      description: description || '',
      date,
      location: location || '',
      capacity: cap,
      tags: Array.isArray(tags) ? tags : [],
      organizerId,
    });
  }

  // PUBLIC_INTERFACE
  update(organizerId, id, payload) {
    const event = store.findEventById(id);
    if (!event) {
      const err = new Error('Event not found');
      err.status = 404;
      throw err;
    }
    if (event.organizerId !== organizerId) {
      const err = new Error('Forbidden: not the organizer');
      err.status = 403;
      throw err;
    }
    const patch = { ...payload };
    if (patch.capacity !== undefined) {
      const cap = Number(patch.capacity);
      if (Number.isNaN(cap) || cap <= 0) {
        const err = new Error('capacity must be a positive number');
        err.status = 400;
        throw err;
      }
      patch.capacity = cap;
    }
    return store.updateEvent(id, patch);
  }

  // PUBLIC_INTERFACE
  delete(organizerId, id) {
    const event = store.findEventById(id);
    if (!event) {
      const err = new Error('Event not found');
      err.status = 404;
      throw err;
    }
    if (event.organizerId !== organizerId) {
      const err = new Error('Forbidden: not the organizer');
      err.status = 403;
      throw err;
    }
    return store.deleteEvent(id);
  }
}

module.exports = new EventsService();
