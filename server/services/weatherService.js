const axios = require('axios');

const getWeather = async (destination) => {
  try {
    const city = destination.split(',')[0].trim();
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey || apiKey === 'your_openweathermap_key_here') {
      console.warn('Weather API key not configured, skipping weather fetch');
      return null;
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: city,
          appid: apiKey,
          units: 'metric',
        },
      }
    );

    const data = response.data;
    return {
      temp: data.main.temp,
      feelsLike: data.main.feels_like,
      tempMin: data.main.temp_min,
      tempMax: data.main.temp_max,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: data.wind?.speed || 0,
      weatherMain: data.weather[0].main, // "Rain", "Snow", "Clear", "Clouds", "Thunderstorm", etc.
    };
  } catch (error) {
    console.error(`Weather fetch failed for "${destination}": ${error.message}`);
    return null;
  }
};

module.exports = { getWeather };
