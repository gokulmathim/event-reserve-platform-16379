const store = require('../models/store');

class BookingsService {
  // PUBLIC_INTERFACE
  book(userId, eventId, tickets = 1) {
    const event = store.findEventById(eventId);
    if (!event) {
      const err = new Error('Event not found');
      err.status = 404;
      throw err;
    }
    const existingBookings = store.listBookingsByEvent(eventId)
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.tickets || 1), 0);

    const requested = Number(tickets);
    if (Number.isNaN(requested) || requested <= 0) {
      const err = new Error('tickets must be a positive number');
      err.status = 400;
      throw err;
    }

    if (existingBookings + requested > event.capacity) {
      const err = new Error('Not enough capacity');
      err.status = 409;
      throw err;
    }

    return store.createBooking({ userId, eventId, tickets: requested });
  }

  // PUBLIC_INTERFACE
  cancel(userId, bookingId) {
    const booking = store.cancelBooking(bookingId, userId);
    if (!booking) {
      const err = new Error('Booking not found');
      err.status = 404;
      throw err;
    }
    return booking;
  }
}

module.exports = new BookingsService();
