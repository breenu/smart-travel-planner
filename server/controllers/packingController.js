const PackingList = require('../models/PackingList');

// GET /api/packing/:tripId
const getPackingList = async (req, res, next) => {
  try {
    const packingList = await PackingList.findOne({
      tripId: req.params.tripId,
      userId: req.user._id,
    });

    if (!packingList) {
      res.status(404);
      throw new Error('Packing list not found');
    }

    res.json({ success: true, data: packingList });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPackingList };
