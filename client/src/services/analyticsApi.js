const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getVideoAnalytics = async (page = 1, limit = 5) => {
  const response = await fetch(
    `${API_URL}/api/analytics/videos?page=${page}&limit=${limit}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch analytics');
  }

  return data;
};

export const createEngagementEvent = async (videoId, eventType) => {
  const response = await fetch(`${API_URL}/api/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      videoId,
      eventType,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create engagement event');
  }

  return data;
};
