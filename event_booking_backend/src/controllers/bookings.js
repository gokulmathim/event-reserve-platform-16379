const { validationResult } = require('express-validator');
const bookingsService = require('../services/bookings');
const store = require('../models/store');

class BookingsController {
  /**
   * POST /events/:id/book
   */
  create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: 'error', errors: errors.array() });
    try {
      const booking = bookingsService.book(req.user.id, req.params.id, req.body.tickets || 1);
      return res.status(201).json({ booking });
    } catch (err) {
      return res.status(err.status || 500).json({ status: 'error', message: err.message });
    }
  }

  /**
   * DELETE /bookings/:id
   */
  cancel(req, res) {
    try {
      const booking = bookingsService.cancel(req.user.id, req.params.id);
      return res.status(200).json({ booking });
    } catch (err) {
      return res.status(err.status || 500).json({ status: 'error', message: err.message });
    }
  }

  /**
   * GET /organizer/events/:id/bookings
   * Organizer listing bookings for their event
   */
  listForEvent(req, res) {
    const eventId = req.params.id;
    const event = store.findEventById(eventId);
    if (!event) return res.status(404).json({ status: 'error', message: 'Event not found' });
    if (event.organizerId !== req.user.id) return res.status(403).json({ status: 'error', message: 'Forbidden' });
    const bookings = store.listBookingsByEvent(eventId);
    return res.status(200).json({ bookings });
  }
}

module.exports = new BookingsController();
