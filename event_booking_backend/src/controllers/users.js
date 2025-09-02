const { validationResult } = require('express-validator');
const usersService = require('../services/users');

class UsersController {
  /**
   * GET /users/me
   */
  async getMe(req, res) {
    const user = usersService.getById(req.user.id);
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
    return res.status(200).json({ user });
  }

  /**
   * PATCH /users/me
   */
  async updateMe(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: 'error', errors: errors.array() });
    const updated = usersService.updateMe(req.user.id, req.body || {});
    if (!updated) return res.status(404).json({ status: 'error', message: 'User not found' });
    return res.status(200).json({ user: updated });
  }

  /**
   * GET /users/me/bookings
   */
  async myBookings(req, res) {
    const list = usersService.listMyBookings(req.user.id);
    return res.status(200).json({ bookings: list });
  }
}

module.exports = new UsersController();
