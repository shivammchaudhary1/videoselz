import db from '../config/database/db.js';

export const getVideoAnalytics = (req, res) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pagination values',
      });
    }

    const offset = (page - 1) * limit;

    const totalResult = db
      .prepare(
        `
        SELECT COUNT(*) AS total
        FROM videos
      `
      )
      .get();

    const total = totalResult.total;
    const totalPages = Math.ceil(total / limit);

    const rows = db
      .prepare(
        `
        SELECT
          v.id,
          v.title,
          v.video_url AS videoUrl,

          p.id AS productId,
          p.name AS productName,
          p.price AS productPrice,

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
          p.price

        ORDER BY v.id ASC

        LIMIT ?
        OFFSET ?
      `
      )
      .all(limit, offset);

    const data = rows.map((row) => ({
      id: row.id,
      title: row.title,
      videoUrl: row.videoUrl,
      product: {
        id: row.productId,
        name: row.productName,
        price: row.productPrice,
      },
      views: row.views,
      clicks: row.clicks,
      conversions: row.conversions,
    }));

    return res.status(200).json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Get video analytics error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch video analytics',
    });
  }
};
