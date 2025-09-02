const { validationResult } = require('express-validator');
const authService = require('../services/auth');

class AuthController {
  /**
   * POST /auth/register
   * Registers a new user and returns a JWT.
   */
  async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: 'error', errors: errors.array() });
    try {
      const { name, email, password, role } = req.body;
      const result = authService.register({ name, email, password, role });
      return res.status(201).json(result);
    } catch (err) {
      return res.status(err.status || 500).json({ status: 'error', message: err.message });
    }
  }

  /**
   * POST /auth/login
   * Logs in an existing user and returns a JWT.
   */
  async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: 'error', errors: errors.array() });
    try {
      const { email, password } = req.body;
      const result = authService.login({ email, password });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(err.status || 500).json({ status: 'error', message: err.message });
    }
  }

  /**
   * GET /auth/me
   * Returns current authenticated user profile.
   */
  async me(req, res) {
    try {
      const me = authService.me(req.user);
      return res.status(200).json({ user: me });
    } catch (err) {
      return res.status(err.status || 500).json({ status: 'error', message: err.message });
    }
  }
}

module.exports = new AuthController();
