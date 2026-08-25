import styles from '../../styles/Pagination.module.css';

function Pagination({ pagination, onPageChange }) {
  const { page, totalPages } = pagination;

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </button>

      <span>
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
