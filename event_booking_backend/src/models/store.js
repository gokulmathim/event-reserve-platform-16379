const { nanoid } = require('nanoid');

/**
 * A simple in-memory store to simulate a database.
 * Replace with a real database in production.
 */
class Store {
  constructor() {
    this.users = []; // {id, name, email, passwordHash, role}
    this.events = []; // {id, title, description, date, location, capacity, organizerId, tags:[], createdAt, updatedAt}
    this.bookings = []; // {id, userId, eventId, tickets, status, createdAt}
  }

  // Users
  createUser(user) {
    const id = nanoid();
    const now = new Date().toISOString();
    const rec = { id, createdAt: now, updatedAt: now, ...user };
    this.users.push(rec);
    return rec;
  }

  updateUser(id, patch) {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...patch, updatedAt: new Date().toISOString() };
    return this.users[idx];
  }

  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find(u => u.id === id);
  }

  // Events
  createEvent(event) {
    const id = nanoid();
    const now = new Date().toISOString();
    const rec = { id, createdAt: now, updatedAt: now, ...event };
    this.events.push(rec);
    return rec;
  }

  updateEvent(id, patch) {
    const idx = this.events.findIndex(e => e.id === id);
    if (idx === -1) return null;
    this.events[idx] = { ...this.events[idx], ...patch, updatedAt: new Date().toISOString() };
    return this.events[idx];
  }

  deleteEvent(id) {
    const idx = this.events.findIndex(e => e.id === id);
    if (idx === -1) return false;
    // also remove bookings associated
    this.bookings = this.bookings.filter(b => b.eventId !== id);
    this.events.splice(idx, 1);
    return true;
  }

  findEventById(id) {
    return this.events.find(e => e.id === id);
  }

  listEvents(filter = {}) {
    let list = [...this.events];
    if (filter.q) {
      const q = filter.q.toLowerCase();
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) ||
        (e.description || '').toLowerCase().includes(q) ||
        (e.location || '').toLowerCase().includes(q) ||
        (e.tags || []).some(tag => tag.toLowerCase().includes(q)));
    }
    if (filter.organizerId) {
      list = list.filter(e => e.organizerId === filter.organizerId);
    }
    if (filter.dateFrom) {
      list = list.filter(e => new Date(e.date) >= new Date(filter.dateFrom));
    }
    if (filter.dateTo) {
      list = list.filter(e => new Date(e.date) <= new Date(filter.dateTo));
    }
    return list;
  }

  // Bookings
  createBooking(booking) {
    const id = nanoid();
    const now = new Date().toISOString();
    const rec = { id, createdAt: now, ...booking, status: 'confirmed' };
    this.bookings.push(rec);
    return rec;
  }

  listBookingsByUser(userId) {
    return this.bookings.filter(b => b.userId === userId);
  }

  listBookingsByEvent(eventId) {
    return this.bookings.filter(b => b.eventId === eventId);
  }

  cancelBooking(id, userId) {
    const booking = this.bookings.find(b => b.id === id && b.userId === userId);
    if (!booking) return null;
    booking.status = 'cancelled';
    return booking;
  }

  getStatsForOrganizer(organizerId) {
    const events = this.events.filter(e => e.organizerId === organizerId);
    const eventIds = new Set(events.map(e => e.id));
    const bookings = this.bookings.filter(b => eventIds.has(b.eventId));
    const ticketsSoldByEvent = {};
    bookings.forEach(b => {
      ticketsSoldByEvent[b.eventId] = (ticketsSoldByEvent[b.eventId] || 0) + (b.tickets || 1);
    });
    return {
      totalEvents: events.length,
      totalBookings: bookings.length,
      ticketsSoldByEvent,
    };
  }
}

module.exports = new Store();
