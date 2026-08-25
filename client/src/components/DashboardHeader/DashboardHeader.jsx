import styles from '../../styles/DashboardHeader.module.css';

function DashboardHeader({ children }) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>Videoselz Analytics</h1>
        <p className={styles.subtitle}>Shoppable Video Performance</p>
      </div>

      {children}
    </header>
  );
}

export default DashboardHeader;
