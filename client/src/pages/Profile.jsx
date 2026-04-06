import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function Profile() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    API.get('/profile')
      .then((res) => {
        setProfile(res.data.data);
        setEditName(res.data.data.user.name);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      const res = await API.put('/profile', { name: editName.trim() });
      setProfile((prev) => ({
        ...prev,
        user: { ...prev.user, name: res.data.data.name },
      }));
      setEditing(false);
      showToast('Profile updated!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update', 'error');
    } finally {
      setSaving(false);
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

  const { user, stats, tripHistory } = profile;

  return (
    <Layout>
      <div className="p-8 md:p-12 max-w-4xl">
        {/* Toast */}
        {toast && (
          <div
            className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
              toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {toast.message}
          </div>
        )}

        <h1 className="font-serif text-3xl md:text-4xl text-brown font-semibold mb-8">
          My Profile
        </h1>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-beige-dark/50 p-6 md:p-8 mb-8">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="px-4 py-2 bg-beige/50 border border-brown/15 rounded-lg text-lg font-semibold text-brown focus:outline-none focus:border-orange/50"
                    autoFocus
                  />
                  <button
                    onClick={handleSave}
                    disabled={saving || !editName.trim()}
                    className="px-4 py-2 bg-orange text-white rounded-lg text-sm font-medium hover:bg-orange-dark transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setEditName(user.name);
                    }}
                    className="px-4 py-2 border border-brown/15 text-brown/60 rounded-lg text-sm hover:bg-beige/50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-semibold text-brown">{user.name}</h2>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-brown/40 hover:text-orange transition-colors p-1"
                    title="Edit name"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                </div>
              )}
              <p className="text-brown/50 text-sm">{user.email}</p>
              <p className="text-brown/40 text-xs mt-1">
                Member since {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-beige-dark/50 p-5 text-center">
            <div className="text-3xl font-bold text-brown mb-1">{stats.totalTrips}</div>
            <div className="text-xs text-brown/50 uppercase tracking-wider">Total Trips</div>
          </div>
          <div className="bg-white rounded-xl border border-beige-dark/50 p-5 text-center">
            <div className="text-3xl font-bold text-orange mb-1">{stats.upcomingTrips}</div>
            <div className="text-xs text-brown/50 uppercase tracking-wider">Upcoming</div>
          </div>
          <div className="bg-white rounded-xl border border-beige-dark/50 p-5 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">{stats.completedTrips}</div>
            <div className="text-xs text-brown/50 uppercase tracking-wider">Completed</div>
          </div>
        </div>

        {/* Trip History */}
        <div className="bg-white rounded-2xl border border-beige-dark/50 p-6 md:p-8">
          <h3 className="font-serif text-xl font-semibold text-brown mb-5">
            Trip History
          </h3>
          {tripHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-brown/50 mb-4">No trips yet</p>
              <button
                onClick={() => navigate('/create-trip')}
                className="px-6 py-2.5 bg-orange text-white rounded-full text-sm font-medium hover:bg-orange-dark transition-colors"
              >
                Create Your First Trip
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {tripHistory.map((trip) => {
                const start = new Date(trip.startDate);
                const end = new Date(trip.endDate);
                const now = new Date();
                const isPast = end < now;
                const isActive = start <= now && end >= now;

                return (
                  <button
                    key={trip._id}
                    onClick={() => navigate(`/trips/${trip._id}`)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-brown/10 hover:border-brown/25 hover:shadow-sm transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-beige flex items-center justify-center text-lg flex-shrink-0">
                      {trip.weather?.icon ? (
                        <img
                          src={`https://openweathermap.org/img/wn/${trip.weather.icon}.png`}
                          alt=""
                          className="w-8 h-8"
                        />
                      ) : (
                        '✈️'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-brown text-sm truncate group-hover:text-orange transition-colors">
                          {trip.destination}
                        </h4>
                        {isActive && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                        {isPast && (
                          <span className="text-xs bg-brown/10 text-brown/50 px-2 py-0.5 rounded-full">
                            Past
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-brown/50 mt-0.5">
                        {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                      </p>
                    </div>
                    <span className="inline-block px-3 py-1 bg-orange/10 text-orange text-xs font-medium rounded-full capitalize">
                      {trip.tripType || 'leisure'}
                    </span>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      className="text-brown/30 group-hover:text-brown/60 transition-colors flex-shrink-0"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
