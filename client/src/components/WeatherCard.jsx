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

export default function WeatherCard({ weather }) {
  if (!weather) {
    return (
      <div className="bg-white rounded-xl p-5 border border-beige-dark/50">
        <p className="text-brown/50 text-sm">Weather data unavailable</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 border border-beige-dark/50">
      <h3 className="text-xs font-semibold text-brown/50 uppercase tracking-wider mb-3">
        Weather Snapshot
      </h3>
      <div className="flex items-center gap-4">
        <span className="text-4xl">{getWeatherIcon(weather.description)}</span>
        <div>
          <p className="text-3xl font-bold text-brown">
            {weather.temp != null ? `${Math.round(weather.temp)}°C` : 'N/A'}
          </p>
          <p className="text-brown/60 capitalize text-sm">{weather.description || 'Unknown'}</p>
        </div>
      </div>
      {weather.humidity != null && (
        <div className="mt-3 pt-3 border-t border-beige-dark/30">
          <div className="flex items-center gap-2 text-sm text-brown/60">
            <span>💧</span>
            <span>Humidity: {weather.humidity}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
