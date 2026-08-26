import styles from '../../styles/TrafficSimulator.module.css';

function TrafficSimulator({ onSimulate, loading }) {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onSimulate}
      disabled={loading}
    >
      {loading ? 'Simulating...' : 'Simulate Traffic'}
    </button>
  );
}

export default TrafficSimulator;
