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

const CATEGORY_ICONS = {
  clothing: '👕',
  toiletries: '🧴',
  electronics: '🔌',
  documents: '📄',
  misc: '📦',
};

export default function PackingList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packingList, setPackingList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  // Add item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('misc');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    API.get(`/packing/${id}`)
      .then((res) => setPackingList(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load packing list'))
      .finally(() => setLoading(false));
  }, [id]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleItem = async (itemId) => {
    const item = packingList.items.find((i) => i._id === itemId);
    if (!item) return;

    // Optimistic update
    setPackingList((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i._id === itemId ? { ...i, isPacked: !i.isPacked } : i
      ),
    }));

    try {
      await API.put(`/packing/${id}/item/${itemId}`, {
        isPacked: !item.isPacked,
      });
    } catch (err) {
      // Revert on error
      setPackingList((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i._id === itemId ? { ...i, isPacked: item.isPacked } : i
        ),
      }));
      showToast('Failed to update item', 'error');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    setAdding(true);
    try {
      const res = await API.post(`/packing/${id}/item`, {
        name: newItemName.trim(),
        category: newItemCategory,
      });
      setPackingList(res.data.data);
      setNewItemName('');
      setNewItemCategory('misc');
      showToast('Item added!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add item', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteItem = async (itemId, itemName) => {
    if (!window.confirm(`Remove "${itemName}" from your packing list?`)) return;

    try {
      const res = await API.delete(`/packing/${id}/item/${itemId}`);
      setPackingList(res.data.data);
      showToast('Item removed');
    } catch (err) {
      showToast('Failed to delete item', 'error');
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

  const items = packingList?.items || [];
  const grouped = groupByCategory(items);
  const packedCount = items.filter((i) => i.isPacked).length;
  const progressPercent = items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0;

  const sortedCategories = Object.keys(grouped).sort(
    (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
  );

  return (
    <Layout>
      <div className="p-8 md:p-12 max-w-3xl">
        {/* Toast notification */}
        {toast && (
          <div
            className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all animate-slide-in ${
              toast.type === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-green-500 text-white'
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-serif text-3xl md:text-4xl text-brown font-semibold">
            Packing List
          </h1>
          <button
            onClick={() => navigate(`/trips/${id}`)}
            className="text-brown/50 hover:text-brown text-sm transition-colors"
          >
            ← Back to trip
          </button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-brown/60 mb-1.5">
            <span>{packedCount} of {items.length} items packed</span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <div className="h-3 bg-brown/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                progressPercent === 100
                  ? 'bg-green-500'
                  : progressPercent > 50
                  ? 'bg-orange'
                  : 'bg-orange/70'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {progressPercent === 100 && (
            <p className="text-green-600 text-sm font-medium mt-2 flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              All packed! You're ready to go!
            </p>
          )}
        </div>

        {/* Add custom item form */}
        <form onSubmit={handleAddItem} className="mb-8 p-4 bg-white rounded-xl border border-beige-dark/50">
          <h3 className="text-xs font-semibold text-brown/50 uppercase tracking-wider mb-3">
            Add Custom Item
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Item name..."
              className="flex-1 px-4 py-2.5 bg-beige/50 border border-brown/10 rounded-lg text-sm text-brown placeholder:text-brown/40 focus:outline-none focus:border-orange/50 transition-colors"
            />
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="px-3 py-2.5 bg-beige/50 border border-brown/10 rounded-lg text-sm text-brown focus:outline-none focus:border-orange/50 transition-colors"
            >
              {CATEGORY_ORDER.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_ICONS[cat]} {cat}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={adding || !newItemName.trim()}
              className="px-5 py-2.5 bg-brown text-beige rounded-lg text-sm font-medium hover:bg-brown-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add
            </button>
          </div>
        </form>

        {/* Categories */}
        {sortedCategories.map((category) => (
          <div key={category} className="mb-8">
            <h2 className="font-serif text-lg font-semibold text-brown capitalize mb-3 flex items-center gap-2">
              <span>{CATEGORY_ICONS[category] || '📦'}</span>
              {category}
              <span className="text-xs font-normal text-brown/40 ml-1">
                ({grouped[category].filter((i) => i.isPacked).length}/{grouped[category].length})
              </span>
            </h2>
            <div className="space-y-2">
              {grouped[category].map((item) => (
                <div
                  key={item._id}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 ${
                    item.isPacked
                      ? 'bg-brown/5 border-brown/10'
                      : 'bg-white border-brown/15 hover:border-brown/30 hover:shadow-sm'
                  }`}
                >
                  <button
                    onClick={() => toggleItem(item._id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                      item.isPacked
                        ? 'bg-orange border-orange text-white scale-110'
                        : 'border-brown/30 hover:border-orange hover:scale-105'
                    }`}
                  >
                    {item.isPacked && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                  <span
                    className={`flex-1 text-sm transition-colors ${
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
                  <button
                    onClick={() => handleDeleteItem(item._id, item.name)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all p-1 rounded hover:bg-red-50"
                    title="Remove item"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    </svg>
                  </button>
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
