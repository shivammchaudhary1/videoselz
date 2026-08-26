import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import db from '../src/config/db/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFilePath = path.resolve(
  __dirname,
  '../src/utility/products.json'
);

const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

const seedDatabase = db.transaction(() => {
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

    db.prepare('DELETE FROM engagement_events').run();
    db.prepare('DELETE FROM videos').run();
    db.prepare('DELETE FROM products').run();

    db.prepare(
      `
      DELETE FROM sqlite_sequence
      WHERE name IN (
        'products',
        'videos',
        'engagement_events'
      )
    `
    ).run();
  } else {
    console.log('No existing seed data found. Creating data...');
  }

  const insertProduct = db.prepare(`
    INSERT INTO products (
      name,
      price,
      image_url,
      category
    )
    VALUES (?, ?, ?, ?)
  `);

  const selectedProducts = products.slice(0, 10);

  const productIds = [];

  for (const product of selectedProducts) {
    const result = insertProduct.run(
      product.title,
      product.price,
      product.image,
      product.category
    );

    productIds.push(Number(result.lastInsertRowid));
  }

  const insertVideo = db.prepare(`
    INSERT INTO videos (
      product_id,
      video_url,
      title
    )
    VALUES (?, ?, ?)
  `);

  const videoIds = [];

  for (let i = 0; i < selectedProducts.length; i++) {
    const product = selectedProducts[i];

    const result = insertVideo.run(
      productIds[i],
      `https://example.com/product-${i + 1}-demo.mp4`,
      `${product.title} Demo`
    );

    videoIds.push(Number(result.lastInsertRowid));
  }

  const insertEvent = db.prepare(`
    INSERT INTO engagement_events (
      video_id,
      event_type
    )
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

  // Keep the last video without engagement events
  // to verify LEFT JOIN behavior.
  const videosWithEvents = videoIds.slice(0, -1);

  for (let i = 0; i < 180; i++) {
    const randomVideoIndex = Math.floor(
      Math.random() * videosWithEvents.length
    );

    const randomEventIndex = Math.floor(Math.random() * eventTypes.length);

    const videoId = videosWithEvents[randomVideoIndex];
    const eventType = eventTypes[randomEventIndex];

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
