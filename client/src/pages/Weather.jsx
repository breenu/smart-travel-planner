import { useState } from 'react';
import Layout from '../components/Layout';
import API from '../api/axios';

function getWeatherIcon(description) {
  if (!description) return '🌍';
  const d = description.toLowerCase();
  if (d.includes('clear') || d.includes('sun')) return '☀️';
  if (d.includes('cloud')) return '☁️';
  if (d.includes('rain') || d.includes('drizzle')) return '🌧️';
  if (d.includes('snow')) return '❄️';
  if (d.includes('thunder') || d.includes('storm')) return '⛈️';
  if (d.includes('mist') || d.includes('fog') || d.includes('haze')) return '🌫️';
  return '🌤️';
}

export default function Weather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setError('');
    setWeather(null);
    setLoading(true);
    try {
      const res = await API.get(`/weather?city=${encodeURIComponent(city.trim())}`);
      setWeather(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch weather. Try another city.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-8 md:p-12 max-w-2xl">
        <h1 className="font-serif text-3xl md:text-4xl text-brown font-semibold mb-2">
          Weather
        </h1>
        <p className="text-brown/60 text-sm mb-8">
          Look up current weather at your travel destination. Enter a specific city name for accurate results.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter a city name, e.g. Mumbai, Delhi, Paris"
            className="flex-1 px-4 py-3 rounded-lg border border-brown/20 bg-white text-brown placeholder-brown/40 focus:outline-none focus:border-orange transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !city.trim()}
            className="px-6 py-3 bg-brown text-beige rounded-full text-sm font-medium hover:bg-brown-dark transition-colors disabled:opacity-40"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Result */}
        {weather && (
          <div className="bg-white rounded-2xl p-8 border border-beige-dark/50 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl text-brown font-semibold capitalize">
                  {weather.city}
                </h2>
                <p className="text-brown/50 text-sm capitalize mt-1">{weather.description}</p>
              </div>
              <span className="text-6xl">{getWeatherIcon(weather.description)}</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-beige rounded-xl p-4 text-center">
                <p className="text-xs text-brown/50 uppercase tracking-wider mb-1">Temperature</p>
                <p className="text-2xl font-bold text-brown">{Math.round(weather.temp)}°C</p>
              </div>
              <div className="bg-beige rounded-xl p-4 text-center">
                <p className="text-xs text-brown/50 uppercase tracking-wider mb-1">Feels Like</p>
                <p className="text-2xl font-bold text-brown">
                  {weather.feelsLike != null ? `${Math.round(weather.feelsLike)}°C` : 'N/A'}
                </p>
              </div>
              <div className="bg-beige rounded-xl p-4 text-center">
                <p className="text-xs text-brown/50 uppercase tracking-wider mb-1">Humidity</p>
                <p className="text-2xl font-bold text-brown">{weather.humidity}%</p>
              </div>
            </div>
          </div>
        )}

        {!weather && !loading && !error && (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">🌍</span>
            <p className="text-brown/40 text-sm">
              Search for a city to see the current weather conditions.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
