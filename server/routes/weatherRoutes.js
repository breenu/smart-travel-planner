const express = require('express');
const router = express.Router();
const { getWeather } = require('../services/weatherService');

router.get('/', async (req, res, next) => {
  try {
    const { city } = req.query;
    if (!city) {
      res.status(400);
      throw new Error('Please provide a city query parameter');
    }

    const weather = await getWeather(city);
    if (!weather) {
      res.status(502);
      throw new Error('Unable to fetch weather data. Check API key or try a different city.');
    }

    res.json({ success: true, data: { city: city.split(',')[0].trim(), ...weather } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
