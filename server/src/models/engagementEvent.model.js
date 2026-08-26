import db from '../config/db/db.js';

export const createEngagementEvent = (videoId, eventType) => {
  return db
    .prepare(
      `
      INSERT INTO engagement_events (
        video_id,
        event_type
      )
      VALUES (?, ?)
    `
    )
    .run(videoId, eventType);
};
