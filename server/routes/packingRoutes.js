const express = require('express');
const router = express.Router();
const { getPackingList } = require('../controllers/packingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/:tripId', getPackingList);

module.exports = router;
