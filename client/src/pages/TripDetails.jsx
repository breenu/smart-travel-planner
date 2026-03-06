import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import WeatherCard from '../components/WeatherCard';
import API from '../api/axios';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    API.get(`/trips/${id}`)
      .then((res) => setTrip(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load trip'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this trip and its packing list?')) return;
    setDeleting(true);
    try {
      await API.delete(`/trips/${id}`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete trip');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-orange border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-8 md:p-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  const duration = Math.ceil(
    (new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)
  );

  return (
    <Layout>
      <div className="p-8 md:p-12 max-w-4xl">
        {/* Back button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-brown/60 text-sm hover:text-brown mb-6 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to trips
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-brown font-semibold mb-2">
              {trip.destination}
            </h1>
            <p className="text-brown/60 text-sm">
              {formatDate(trip.startDate)} – {formatDate(trip.endDate)} &middot; {duration} days
            </p>
          </div>
          <span className="inline-block px-4 py-1.5 bg-orange/10 text-orange text-sm font-medium rounded-full capitalize">
            {trip.tripType || 'leisure'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Weather */}
          <WeatherCard weather={trip.weather} />

          {/* Activities */}
          <div className="bg-white rounded-xl p-5 border border-beige-dark/50">
            <h3 className="text-xs font-semibold text-brown/50 uppercase tracking-wider mb-3">
              Planned Activities
            </h3>
            {trip.activities?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {trip.activities.map((act) => (
                  <span
                    key={act}
                    className="px-3 py-1.5 bg-beige text-brown text-sm rounded-full capitalize"
                  >
                    {act}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-brown/50 text-sm">No activities specified</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate(`/trips/${id}/packing`)}
            className="px-8 py-3 bg-brown text-beige rounded-full text-sm font-medium hover:bg-brown-dark transition-colors flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            View Packing List
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-6 py-3 border border-red-300 text-red-600 rounded-full text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete Trip'}
          </button>
        </div>
      </div>
    </Layout>
  );
}
