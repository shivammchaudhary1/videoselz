import { useEffect, useState } from 'react';

import {
  getVideoAnalytics,
  createEngagementEvent,
} from './services/analyticsApi.js';

import DashboardHeader from './components/DashboardHeader/DashboardHeader.jsx';
import AnalyticsTable from './components/AnalyticsTable/AnalyticsTable.jsx';
import Pagination from './components/Pagination/Pagination.jsx';
import TrafficSimulator from './components/TrafficSimulator/TrafficSimulator.jsx';

import styles from './styles/App.module.css';

function App() {
  const [videos, setVideos] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState('');

  const limit = 5;

  useEffect(() => {
    let ignore = false;

    getVideoAnalytics(page, limit)
      .then((response) => {
        if (ignore) return;

        setVideos(response.data);
        setPagination(response.pagination);
        setError('');
      })
      .catch((error) => {
        if (ignore) return;

        setError(error.message);
      })
      .finally(() => {
        if (ignore) return;

        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [page]);

  const loadAnalytics = async () => {
    try {
      const response = await getVideoAnalytics(page, limit);

      setVideos(response.data);
      setPagination(response.pagination);
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePageChange = (newPage) => {
    setLoading(true);
    setError('');
    setPage(newPage);
  };

  const handleSimulateTraffic = async () => {
    try {
      setSimulating(true);
      setError('');

      if (videos.length === 0) {
        return;
      }

      const randomVideo = videos[Math.floor(Math.random() * videos.length)];

      const eventTypes = ['view', 'click', 'add_to_cart'];

      const randomEventType =
        eventTypes[Math.floor(Math.random() * eventTypes.length)];

      await createEngagementEvent(randomVideo.id, randomEventType);

      await loadAnalytics();
    } catch (error) {
      setError(error.message);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <DashboardHeader>
          <TrafficSimulator
            onSimulate={handleSimulateTraffic}
            loading={simulating}
          />
        </DashboardHeader>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Video Performance</h2>

          {loading && (
            <div className={styles.message}>Loading analytics...</div>
          )}

          {!loading && error && (
            <div className={`${styles.message} ${styles.error}`}>{error}</div>
          )}

          {!loading && !error && videos.length === 0 && (
            <div className={styles.message}>No videos found.</div>
          )}

          {!loading && !error && videos.length > 0 && (
            <>
              <AnalyticsTable videos={videos} />

              {pagination && (
                <Pagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
