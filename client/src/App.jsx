import { useEffect, useState } from 'react';
import { getVideoAnalytics } from './services/analyticsApi.js';
import styles from './styles/App.module.css';

function App() {
  const [videos, setVideos] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await getVideoAnalytics(1, 5);

        setVideos(response.data);
        setPagination(response.pagination);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <h1 className={styles.heading}>Videoselz Analytics</h1>
        <p className={styles.subtitle}>Shoppable Video Performance</p>

        <h2 className={styles.sectionTitle}>Videos</h2>

        {loading && <p className={styles.message}>Loading analytics...</p>}

        {error && <p className={styles.message}>{error}</p>}

        {!loading && !error && videos.length === 0 && (
          <p className={styles.message}>No videos found.</p>
        )}

        {!loading && !error && videos.length > 0 && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Video</th>
                  <th>Product</th>
                  <th>Views</th>
                  <th>Clicks</th>
                  <th>Conversions</th>
                </tr>
              </thead>

              <tbody>
                {videos.map((video) => (
                  <tr key={video.id}>
                    <td>{video.title}</td>
                    <td>{video.product.name}</td>
                    <td>{video.views}</td>
                    <td>{video.clicks}</td>
                    <td>{video.conversions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && (
          <p className={styles.paginationInfo}>
            Page {pagination.page} of {pagination.totalPages}
          </p>
        )}
      </main>
    </div>
  );
}

export default App;
