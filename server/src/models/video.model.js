import db from '../config/db/db.js';

export const findVideoById = (videoId) => {
  return db
    .prepare(
      `
      SELECT id
      FROM videos
      WHERE id = ?
    `
    )
    .get(videoId);
};

export const getTotalVideos = () => {
  const result = db
    .prepare(
      `
      SELECT COUNT(*) AS total
      FROM videos
    `
    )
    .get();

  return result.total;
};

export const getVideoAnalyticsRows = (limit, offset) => {
  return db
    .prepare(
      `
      SELECT
        v.id,
        v.title,
        v.video_url AS videoUrl,

        p.id AS productId,
        p.name AS productName,
        p.price AS productPrice,
        p.image_url AS productImageUrl,
        p.category AS productCategory,

        SUM(
          CASE
            WHEN e.event_type = 'view' THEN 1
            ELSE 0
          END
        ) AS views,

        SUM(
          CASE
            WHEN e.event_type = 'click' THEN 1
            ELSE 0
          END
        ) AS clicks,

        SUM(
          CASE
            WHEN e.event_type = 'add_to_cart' THEN 1
            ELSE 0
          END
        ) AS conversions

      FROM videos v

      JOIN products p
        ON p.id = v.product_id

      LEFT JOIN engagement_events e
        ON e.video_id = v.id

      GROUP BY
        v.id,
        v.title,
        v.video_url,
        p.id,
        p.name,
        p.price,
        p.image_url,
        p.category

      ORDER BY v.id ASC

      LIMIT ?
      OFFSET ?
    `
    )
    .all(limit, offset);
};
