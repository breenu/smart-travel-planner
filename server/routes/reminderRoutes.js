const express = require('express');
const router = express.Router();
const { getReminders, getAllReminders } = require('../controllers/reminderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAllReminders);
router.get('/:tripId', getReminders);

module.exports = router;
