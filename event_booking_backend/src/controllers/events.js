const { validationResult } = require('express-validator');
const eventsService = require('../services/events');

class EventsController {
  /**
   * GET /events
   */
  list(req, res) {
    const { q, dateFrom, dateTo } = req.query;
    const events = eventsService.list({ q, dateFrom, dateTo });
    return res.status(200).json({ events });
  }

  /**
   * GET /events/:id
   */
  get(req, res) {
    const event = eventsService.getById(req.params.id);
    if (!event) return res.status(404).json({ status: 'error', message: 'Event not found' });
    return res.status(200).json({ event });
  }

  /**
   * POST /organizer/events
   */
  create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: 'error', errors: errors.array() });
    try {
      const event = eventsService.create(req.user.id, req.body);
      return res.status(201).json({ event });
    } catch (err) {
      return res.status(err.status || 500).json({ status: 'error', message: err.message });
    }
  }

  /**
   * PATCH /organizer/events/:id
   */
  update(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: 'error', errors: errors.array() });
    try {
      const event = eventsService.update(req.user.id, req.params.id, req.body);
      return res.status(200).json({ event });
    } catch (err) {
      return res.status(err.status || 500).json({ status: 'error', message: err.message });
    }
  }

  /**
   * DELETE /organizer/events/:id
   */
  delete(req, res) {
    try {
      const ok = eventsService.delete(req.user.id, req.params.id);
      if (!ok) return res.status(404).json({ status: 'error', message: 'Event not found' });
      return res.status(204).send();
    } catch (err) {
      return res.status(err.status || 500).json({ status: 'error', message: err.message });
    }
  }
}

module.exports = new EventsController();
