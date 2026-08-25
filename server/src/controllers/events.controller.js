import db from '../config/database/db.js';

const allowedEventTypes = ['view', 'click', 'add_to_cart'];

export const createEvent = (req, res) => {
  try {
    const { videoId, eventType } = req.body;

    if (!videoId || !eventType) {
      return res.status(400).json({
        success: false,
        message: 'videoId and eventType are required',
      });
    }

    if (!Number.isInteger(videoId) || videoId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'videoId must be a positive integer',
      });
    }

    if (!allowedEventTypes.includes(eventType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid eventType',
      });
    }

    const video = db.prepare('SELECT id FROM videos WHERE id = ?').get(videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    const result = db
      .prepare(
        `
        INSERT INTO engagement_events (video_id, event_type)
        VALUES (?, ?)
      `
      )
      .run(videoId, eventType);

    return res.status(201).json({
      success: true,
      message: 'Engagement event recorded',
      data: {
        id: Number(result.lastInsertRowid),
        videoId,
        eventType,
      },
    });
  } catch (error) {
    console.error('Create event error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to record engagement event',
    });
  }
};
