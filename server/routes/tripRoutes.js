const express = require('express');
const router = express.Router();
const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').post(createTrip).get(getTrips);
router.route('/:id').get(getTripById).put(updateTrip).delete(deleteTrip);

module.exports = router;
