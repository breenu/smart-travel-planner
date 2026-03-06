import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import API from '../api/axios';

const TRIP_TYPES = ['leisure', 'business', 'adventure', 'family'];

const ACTIVITIES = [
  'sightseeing',
  'hiking',
  'swimming',
  'dining',
  'shopping',
  'camping',
  'skiing',
  'beach',
  'photography',
  'nightlife',
];

export default function CreateTrip() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tripType, setTripType] = useState('');
  const [activities, setActivities] = useState([]);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const toggleActivity = (act) => {
    setActivities((prev) =>
      prev.includes(act) ? prev.filter((a) => a !== act) : [...prev, act]
    );
  };

  const handleSubmit = async () => {
    setError('');
    if (!destination || !startDate || !endDate) {
      setError('Please fill in destination and dates');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/trips', {
        destination,
        startDate,
        endDate,
        activities,
        tripType: tripType || 'leisure',
      });
      navigate(`/trips/${res.data.data.trip._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-8 md:p-12 max-w-3xl">
        <h1 className="font-serif text-3xl md:text-4xl text-brown font-semibold mb-4">
          Create New List
        </h1>

        {/* Progress bar */}
        <div className="relative mb-10">
          <div className="h-1 bg-brown/10 rounded-full">
            <div
              className="h-1 bg-darkblue rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 text-orange"
            style={{ left: `${progress}%`, transform: `translateX(-50%) translateY(-50%)` }}
          >
            ✈️
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Destination & Dates */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-brown/70 uppercase tracking-wider mb-2">
                Where is your vacation destination?
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Paris, France"
                className="w-full px-4 py-3 rounded-lg border border-brown/20 bg-white text-brown placeholder-brown/40 focus:outline-none focus:border-orange transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brown/70 uppercase tracking-wider mb-2">
                  Start date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-brown/20 bg-white text-brown focus:outline-none focus:border-orange transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brown/70 uppercase tracking-wider mb-2">
                  End date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-brown/20 bg-white text-brown focus:outline-none focus:border-orange transition-colors"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!destination || !startDate || !endDate}
              className="px-8 py-3 bg-brown text-beige rounded-full text-sm font-medium hover:bg-brown-dark transition-colors disabled:opacity-40 mt-4"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: Trip Type */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-brown/70 uppercase tracking-wider mb-3">
                What type of trip is this?
              </label>
              <div className="space-y-2">
                {TRIP_TYPES.map((type) => (
                  <label
                    key={type}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                      tripType === type
                        ? 'border-orange bg-orange/5'
                        : 'border-brown/20 bg-white hover:border-brown/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tripType"
                      value={type}
                      checked={tripType === type}
                      onChange={() => setTripType(type)}
                      className="w-4 h-4 accent-orange"
                    />
                    <span className="text-brown capitalize font-medium">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep(1)}
                className="px-8 py-3 border border-brown/30 text-brown rounded-full text-sm font-medium hover:bg-brown/5 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!tripType}
                className="px-8 py-3 bg-brown text-beige rounded-full text-sm font-medium hover:bg-brown-dark transition-colors disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Activities */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-brown/70 uppercase tracking-wider mb-3">
                What activities are you planning?
              </label>
              <div className="flex flex-wrap gap-2">
                {ACTIVITIES.map((act) => (
                  <button
                    key={act}
                    onClick={() => toggleActivity(act)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                      activities.includes(act)
                        ? 'bg-orange text-white'
                        : 'bg-white border border-brown/20 text-brown hover:border-orange/50'
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3 border border-brown/30 text-brown rounded-full text-sm font-medium hover:bg-brown/5 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-orange text-white rounded-full text-sm font-medium hover:bg-orange-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Generate Packing List'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
