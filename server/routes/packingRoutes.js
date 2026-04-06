const express = require('express');
const router = express.Router();
const { getPackingList, updateItem, addItem, deleteItem } = require('../controllers/packingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/:tripId', getPackingList);
router.put('/:tripId/item/:itemId', updateItem);
router.post('/:tripId/item', addItem);
router.delete('/:tripId/item/:itemId', deleteItem);

module.exports = router;
