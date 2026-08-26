import styles from '../../styles/AnalyticsTable.module.css';

function AnalyticsTable({ videos }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Video</th>
            <th>Product</th>
            <th>Views</th>
            <th>Clicks</th>
            <th>Conversions</th>
            <th>Conversion Rate</th>
          </tr>
        </thead>

        <tbody>
          {videos.map((video) => {
            const conversionRate =
              video.views > 0 ? (video.conversions / video.views) * 100 : 0;

            return (
              <tr key={video.id}>
                <td>{video.title}</td>

                <td>
                  <div className={styles.product}>
                    <div className={styles.imageWrapper}>
                      {video.product.imageUrl ? (
                        <img
                          src={video.product.imageUrl}
                          alt={video.product.name}
                          className={styles.productImage}
                        />
                      ) : (
                        <div className={styles.imageFallback}>No image</div>
                      )}
                    </div>

                    <div className={styles.productDetails}>
                      <div className={styles.productName}>
                        {video.product.name}
                      </div>

                      <div className={styles.productCategory}>
                        {video.product.category}
                      </div>

                      <div className={styles.productPrice}>
                        ${video.product.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </td>

                <td className={styles.metric}>{video.views}</td>

                <td className={styles.metric}>{video.clicks}</td>

                <td className={styles.metric}>{video.conversions}</td>

                <td>
                  <span className={styles.conversionRate}>
                    {conversionRate.toFixed(2)}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AnalyticsTable;
