import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import API from '../api/axios';

function groupByCategory(items) {
  return items.reduce((groups, item) => {
    const cat = item.category || 'misc';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
    return groups;
  }, {});
}

const CATEGORY_ORDER = ['clothing', 'toiletries', 'electronics', 'documents', 'misc'];

export default function PackingList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packingList, setPackingList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/packing/${id}`)
      .then((res) => setPackingList(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load packing list'))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleItem = (itemId) => {
    setPackingList((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item._id === itemId ? { ...item, isPacked: !item.isPacked } : item
      ),
    }));
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

  const items = packingList?.items || [];
  const grouped = groupByCategory(items);
  const packedCount = items.filter((i) => i.isPacked).length;

  const sortedCategories = Object.keys(grouped).sort(
    (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
  );

  return (
    <Layout>
      <div className="p-8 md:p-12 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-serif text-3xl md:text-4xl text-brown font-semibold">
            List
          </h1>
          <button
            onClick={() => navigate(`/trips/${id}`)}
            className="text-brown/50 hover:text-brown text-sm transition-colors"
          >
            ← Back to trip
          </button>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-brown/60 mb-1.5">
            <span>{packedCount} of {items.length} items packed</span>
            <span>{items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0}%</span>
          </div>
          <div className="h-2 bg-brown/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange rounded-full transition-all duration-300"
              style={{ width: `${items.length > 0 ? (packedCount / items.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Categories */}
        {sortedCategories.map((category) => (
          <div key={category} className="mb-8">
            <h2 className="font-serif text-lg font-semibold text-brown capitalize mb-3">
              {category}
            </h2>
            <div className="space-y-2">
              {grouped[category].map((item) => (
                <div
                  key={item._id}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
                    item.isPacked
                      ? 'bg-brown/5 border-brown/10'
                      : 'bg-white border-brown/15 hover:border-brown/30'
                  }`}
                >
                  <button
                    onClick={() => toggleItem(item._id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      item.isPacked
                        ? 'bg-orange border-orange text-white'
                        : 'border-brown/30 hover:border-orange'
                    }`}
                  >
                    {item.isPacked && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                  <span
                    className={`flex-1 text-sm ${
                      item.isPacked ? 'line-through text-brown/40' : 'text-brown'
                    }`}
                  >
                    {item.name}
                  </span>
                  {item.isCustom && (
                    <span className="text-xs text-orange/70 bg-orange/10 px-2 py-0.5 rounded-full">
                      custom
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-brown/50">No items in this packing list.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
