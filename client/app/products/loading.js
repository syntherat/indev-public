export default function ProductsLoading() {
  return (
    <main className="products-page-root" aria-busy="true" aria-live="polite">
      <section className="products-page-head">
        <div className="products-page-shell products-skeleton-head">
          <div className="products-skeleton-kicker shimmer" />
          <div className="products-skeleton-title shimmer" />
          <div className="products-skeleton-copy shimmer" />
        </div>
      </section>

      <section className="products-catalog-wrap">
        <div className="products-page-shell products-catalog-layout">
          <aside className="products-filters-panel products-skeleton-panel" aria-hidden="true">
            <div className="products-filters-head">
              <div className="products-skeleton-filter-title shimmer" />
              <div className="products-skeleton-filter-count shimmer" />
            </div>

            <div className="products-filter-form">
              <div className="products-skeleton-input shimmer" />
              <div className="products-skeleton-input shimmer" />
              <div className="products-skeleton-input shimmer" />
              <div className="products-skeleton-button shimmer" />
            </div>
          </aside>

          <div className="products-catalog-main" aria-hidden="true">
            <div className="products-catalog-toolbar products-skeleton-toolbar">
              <div className="products-skeleton-toolbar-left shimmer" />
              <div className="products-skeleton-toolbar-right shimmer" />
            </div>

            <div className="products-catalog-grid">
              {Array.from({ length: 6 }).map((_, index) => (
                <article className="products-catalog-card products-skeleton-card" key={`products-skeleton-${index}`}>
                  <div className="products-card-media">
                    <div className="products-skeleton-media shimmer" />
                  </div>

                  <div className="products-card-body">
                    <div className="products-skeleton-line products-skeleton-line-title shimmer" />
                    <div className="products-skeleton-line products-skeleton-line-kicker shimmer" />
                    <div className="products-skeleton-line shimmer" />
                    <div className="products-skeleton-line products-skeleton-line-short shimmer" />
                    <div className="products-card-bottom">
                      <div className="products-skeleton-meta shimmer" />
                      <div className="products-skeleton-icon shimmer" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
