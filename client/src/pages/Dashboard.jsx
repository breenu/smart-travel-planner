import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TripCard from '../components/TripCard';
import API from '../api/axios';

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/trips')
      .then((res) => setTrips(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load trips'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="p-8 md:p-12 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-brown font-semibold">
            My Trips
          </h1>
          <button
            onClick={() => navigate('/create-trip')}
            className="px-6 py-2.5 bg-brown text-beige rounded-full text-sm font-medium hover:bg-brown-dark transition-colors flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Trip
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">✈️</div>
            <h2 className="font-serif text-2xl text-brown mb-2">No trips yet</h2>
            <p className="text-brown/60 mb-6">
              Create your first trip to get a personalized packing list!
            </p>
            <button
              onClick={() => navigate('/create-trip')}
              className="px-8 py-3 bg-orange text-white rounded-full text-sm font-medium hover:bg-orange-dark transition-colors"
            >
              Create Your First Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trips.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
