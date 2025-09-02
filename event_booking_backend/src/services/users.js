const store = require('../models/store');

class UsersService {
  // PUBLIC_INTERFACE
  /**
   * Get user by id (public safe).
   */
  getById(id) {
    const user = store.findUserById(id);
    if (!user) return null;
    const { passwordHash, ...safe } = user;
    return safe;
  }

  // PUBLIC_INTERFACE
  /**
   * Update current user profile.
   */
  updateMe(id, payload) {
    const patch = {};
    if (payload.name) patch.name = payload.name;
    if (payload.role) patch.role = payload.role; // in real apps, restrict!
    const updated = store.updateUser(id, patch);
    if (!updated) return null;
    const { passwordHash, ...safe } = updated;
    return safe;
  }

  // PUBLIC_INTERFACE
  listMyBookings(userId) {
    return store.listBookingsByUser(userId);
  }
}

module.exports = new UsersService();
