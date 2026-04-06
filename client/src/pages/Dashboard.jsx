import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TripCard from '../components/TripCard';
import API from '../api/axios';

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      API.get('/trips'),
      API.get('/reminders').catch(() => ({ data: { data: [] } })),
    ])
      .then(([tripsRes, remindersRes]) => {
        setTrips(tripsRes.data.data);
        setReminders(remindersRes.data.data || []);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load trips'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="p-8 md:p-12 max-w-6xl">
        {/* Reminder Banners */}
        {reminders.length > 0 && (
          <div className="mb-6 space-y-3">
            {reminders.map((reminder) => (
              <div
                key={reminder.trip._id}
                className="flex items-center gap-4 px-5 py-4 bg-gradient-to-r from-orange/10 to-orange/5 border border-orange/20 rounded-xl"
              >
                <div className="w-10 h-10 bg-orange/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D2773F" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-brown">
                    <span className="text-orange font-semibold">{reminder.trip.destination}</span>
                    {' — '}
                    {reminder.daysUntilTrip === 0
                      ? 'starts today!'
                      : reminder.daysUntilTrip === 1
                      ? 'starts tomorrow!'
                      : `starts in ${reminder.daysUntilTrip} days`}
                  </p>
                  <p className="text-xs text-brown/50 mt-0.5">
                    {reminder.unpackedCount} item{reminder.unpackedCount !== 1 ? 's' : ''} still unpacked
                    {' · '}
                    {reminder.packedItems}/{reminder.totalItems} packed
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/trips/${reminder.trip._id}/packing`)}
                  className="px-4 py-2 bg-orange text-white rounded-lg text-xs font-medium hover:bg-orange-dark transition-colors flex-shrink-0"
                >
                  Pack Now
                </button>
              </div>
            ))}
          </div>
        )}

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
