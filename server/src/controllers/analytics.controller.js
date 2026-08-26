import {
  getTotalVideos,
  getVideoAnalyticsRows,
} from '../models/video.model.js';

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

    const total = getTotalVideos();

    const totalPages = Math.ceil(total / limit);

    const rows = getVideoAnalyticsRows(limit, offset);

    const data = rows.map((row) => ({
      id: row.id,
      title: row.title,
      videoUrl: row.videoUrl,

      product: {
        id: row.productId,
        name: row.productName,
        price: row.productPrice,
        imageUrl: row.productImageUrl,
        category: row.productCategory,
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
