const essentials = [
  { name: 'Toothbrush', category: 'toiletries' },
  { name: 'Toothpaste', category: 'toiletries' },
  { name: 'Deodorant', category: 'toiletries' },
  { name: 'Shampoo', category: 'toiletries' },
  { name: 'Phone charger', category: 'electronics' },
  { name: 'Passport / ID', category: 'documents' },
  { name: 'Wallet', category: 'documents' },
  { name: 'Underwear', category: 'clothing' },
  { name: 'Socks', category: 'clothing' },
  { name: 'T-shirts', category: 'clothing' },
  { name: 'Pants / Trousers', category: 'clothing' },
  { name: 'Sleepwear', category: 'clothing' },
];

// Items added when temperature is below a threshold (cold weather)
const coldWeatherItems = [
  { name: 'Warm jacket', category: 'clothing', tempBelow: 15 },
  { name: 'Sweater / Hoodie', category: 'clothing', tempBelow: 18 },
  { name: 'Thermal underwear', category: 'clothing', tempBelow: 5 },
  { name: 'Gloves', category: 'clothing', tempBelow: 5 },
  { name: 'Scarf', category: 'clothing', tempBelow: 10 },
  { name: 'Beanie / Warm hat', category: 'clothing', tempBelow: 10 },
];

// Items added when temperature is above a threshold (warm weather)
const warmWeatherItems = [
  { name: 'Sunscreen', category: 'toiletries', tempAbove: 22 },
  { name: 'Sunglasses', category: 'misc', tempAbove: 22 },
  { name: 'Shorts', category: 'clothing', tempAbove: 25 },
  { name: 'Sandals', category: 'clothing', tempAbove: 25 },
  { name: 'Hat / Cap', category: 'clothing', tempAbove: 25 },
  { name: 'Light / breathable shirts', category: 'clothing', tempAbove: 28 },
];

// Items based on activities
const activityItems = {
  hiking: [
    { name: 'Hiking boots', category: 'clothing' },
    { name: 'Backpack (daypack)', category: 'misc' },
    { name: 'Water bottle', category: 'misc' },
    { name: 'Rain jacket', category: 'clothing' },
  ],
  swimming: [
    { name: 'Swimsuit', category: 'clothing' },
    { name: 'Towel', category: 'misc' },
    { name: 'Waterproof phone pouch', category: 'electronics' },
  ],
  sightseeing: [
    { name: 'Comfortable walking shoes', category: 'clothing' },
    { name: 'Camera', category: 'electronics' },
    { name: 'Portable power bank', category: 'electronics' },
  ],
  dining: [
    { name: 'Formal / smart-casual outfit', category: 'clothing' },
  ],
  camping: [
    { name: 'Sleeping bag', category: 'misc' },
    { name: 'Flashlight / Headlamp', category: 'electronics' },
    { name: 'Insect repellent', category: 'toiletries' },
    { name: 'First aid kit', category: 'misc' },
  ],
  skiing: [
    { name: 'Ski jacket', category: 'clothing' },
    { name: 'Ski pants', category: 'clothing' },
    { name: 'Ski goggles', category: 'misc' },
    { name: 'Thermal layers', category: 'clothing' },
  ],
  beach: [
    { name: 'Swimsuit', category: 'clothing' },
    { name: 'Beach towel', category: 'misc' },
    { name: 'Flip flops', category: 'clothing' },
    { name: 'Sunscreen', category: 'toiletries' },
  ],
};

// Items based on trip type
const tripTypeItems = {
  business: [
    { name: 'Laptop', category: 'electronics' },
    { name: 'Laptop charger', category: 'electronics' },
    { name: 'Formal shoes', category: 'clothing' },
    { name: 'Business attire', category: 'clothing' },
    { name: 'Notebook / Planner', category: 'misc' },
  ],
  adventure: [
    { name: 'First aid kit', category: 'misc' },
    { name: 'Multi-tool / Swiss knife', category: 'misc' },
    { name: 'Headlamp', category: 'electronics' },
  ],
  family: [
    { name: 'Snacks', category: 'misc' },
    { name: 'Entertainment (books / games)', category: 'misc' },
    { name: 'First aid kit', category: 'misc' },
  ],
  leisure: [
    { name: 'Book / Kindle', category: 'misc' },
    { name: 'Comfortable clothing', category: 'clothing' },
  ],
};

// Duration-based additions
const getDurationItems = (days) => {
  const items = [];
  if (days > 3) {
    items.push({ name: 'Laundry bag', category: 'misc' });
  }
  if (days > 7) {
    items.push({ name: 'Travel-size laundry detergent', category: 'toiletries' });
    items.push({ name: 'Extra bag for souvenirs', category: 'misc' });
  }
  return items;
};

module.exports = {
  essentials,
  coldWeatherItems,
  warmWeatherItems,
  activityItems,
  tripTypeItems,
  getDurationItems,
};
