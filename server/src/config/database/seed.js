import db from './db.js';

const seedDatabase = db.transaction(() => {
  // Check if data already exists
  const productCount = db
    .prepare('SELECT COUNT(*) AS count FROM products')
    .get().count;

  const videoCount = db
    .prepare('SELECT COUNT(*) AS count FROM videos')
    .get().count;

  const eventCount = db
    .prepare('SELECT COUNT(*) AS count FROM engagement_events')
    .get().count;

  if (productCount > 0 || videoCount > 0 || eventCount > 0) {
    console.log('Existing seed data found. Replacing it...');

    // Delete children before parents
    db.prepare('DELETE FROM engagement_events').run();
    db.prepare('DELETE FROM videos').run();
    db.prepare('DELETE FROM products').run();

    // Reset AUTOINCREMENT counters
    db.prepare(
      `
      DELETE FROM sqlite_sequence
      WHERE name IN ('products', 'videos', 'engagement_events')
    `
    ).run();
  } else {
    console.log('No existing seed data found. Creating data...');
  }

  const insertProduct = db.prepare(`
    INSERT INTO products (name, price)
    VALUES (?, ?)
  `);

  // IMPORTANT:
  // We save the generated product IDs instead of assuming 1, 2, 3...
  const productIds = [];

  const products = [
    ['Running Shoes', 89.99],
    ['Wireless Headphones', 129.99],
    ['Travel Backpack', 74.99],
    ['Coffee Maker', 59.99],
    ['Fitness Watch', 149.99],
  ];

  for (const product of products) {
    const result = insertProduct.run(...product);
    productIds.push(Number(result.lastInsertRowid));
  }

  const insertVideo = db.prepare(`
    INSERT INTO videos (product_id, video_url, title)
    VALUES (?, ?, ?)
  `);

  const videos = [
    [productIds[0], 'https://example.com/shoes-demo.mp4', 'Running Shoes Demo'],
    [
      productIds[0],
      'https://example.com/shoes-review.mp4',
      'Running Shoes Review',
    ],
    [
      productIds[1],
      'https://example.com/headphones-demo.mp4',
      'Headphones Demo',
    ],
    [
      productIds[1],
      'https://example.com/headphones-review.mp4',
      'Headphones Review',
    ],
    [
      productIds[2],
      'https://example.com/backpack-demo.mp4',
      'Travel Backpack Demo',
    ],
    [
      productIds[2],
      'https://example.com/backpack-review.mp4',
      'Travel Backpack Review',
    ],
    [productIds[3], 'https://example.com/coffee-demo.mp4', 'Coffee Maker Demo'],
    [
      productIds[3],
      'https://example.com/coffee-review.mp4',
      'Coffee Maker Review',
    ],
    [productIds[4], 'https://example.com/watch-demo.mp4', 'Fitness Watch Demo'],
    [
      productIds[4],
      'https://example.com/watch-review.mp4',
      'Fitness Watch Review',
    ],
  ];

  // Again, save actual generated video IDs
  const videoIds = [];

  for (const video of videos) {
    const result = insertVideo.run(...video);
    videoIds.push(Number(result.lastInsertRowid));
  }

  const insertEvent = db.prepare(`
    INSERT INTO engagement_events (video_id, event_type)
    VALUES (?, ?)
  `);

  const eventTypes = [
    'view',
    'view',
    'view',
    'view',
    'view',
    'view',
    'click',
    'click',
    'click',
    'add_to_cart',
  ];

  // First 9 videos get events.
  // Last video intentionally stays at 0 events.
  const videosWithEvents = videoIds.slice(0, -1);

  for (let i = 0; i < 150; i++) {
    const videoId =
      videosWithEvents[Math.floor(Math.random() * videosWithEvents.length)];

    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

    insertEvent.run(videoId, eventType);
  }
});

try {
  seedDatabase();

  const summary = {
    products: db.prepare('SELECT COUNT(*) AS count FROM products').get().count,
    videos: db.prepare('SELECT COUNT(*) AS count FROM videos').get().count,
    events: db.prepare('SELECT COUNT(*) AS count FROM engagement_events').get()
      .count,
  };

  console.log('Database seeded successfully.');
  console.table(summary);
} catch (error) {
  console.error('Database seed failed:', error.message);
  process.exitCode = 1;
} finally {
  db.close();
}
