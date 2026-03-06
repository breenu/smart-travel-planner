const {
  essentials,
  coldWeatherItems,
  warmWeatherItems,
  activityItems,
  tripTypeItems,
  getDurationItems,
} = require('../utils/packingRules');

const generateList = (weather, activities = [], duration = 3, tripType = 'leisure') => {
  const itemMap = new Map();

  const addItem = (item) => {
    const key = item.name.toLowerCase();
    if (!itemMap.has(key)) {
      itemMap.set(key, {
        name: item.name,
        category: item.category,
        isPacked: false,
        isCustom: false,
      });
    }
  };

  // 1. Always-include essentials
  essentials.forEach(addItem);

  // 2. Weather-based items
  if (weather && weather.temp != null) {
    const temp = weather.temp;

    coldWeatherItems.forEach((item) => {
      if (temp < item.tempBelow) addItem(item);
    });

    warmWeatherItems.forEach((item) => {
      if (temp > item.tempAbove) addItem(item);
    });
  } else {
    // No weather data -- add a moderate set of weather items as fallback
    addItem({ name: 'Light jacket', category: 'clothing' });
    addItem({ name: 'Sunscreen', category: 'toiletries' });
    addItem({ name: 'Sunglasses', category: 'misc' });
  }

  // 3. Activity-based items
  activities.forEach((activity) => {
    const key = activity.toLowerCase().trim();
    if (activityItems[key]) {
      activityItems[key].forEach(addItem);
    }
  });

  // 4. Trip-type-based items
  const typeKey = tripType.toLowerCase().trim();
  if (tripTypeItems[typeKey]) {
    tripTypeItems[typeKey].forEach(addItem);
  }

  // 5. Duration-based items
  getDurationItems(duration).forEach(addItem);

  return Array.from(itemMap.values());
};

module.exports = { generateList };
