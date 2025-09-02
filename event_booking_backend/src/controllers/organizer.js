const store = require('../models/store');

class OrganizerController {
  /**
   * GET /organizer/stats
   * Returns aggregate counts for the organizer dashboard.
   */
  stats(req, res) {
    const stats = store.getStatsForOrganizer(req.user.id);
    return res.status(200).json({ stats });
  }
}

module.exports = new OrganizerController();
