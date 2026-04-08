import { getProductsCatalog } from "@/lib/productsApi";
import PurchaseAwareProductsGrid from "@/components/products/PurchaseAwareProductsGrid";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }) {
  const q = typeof searchParams?.q === "string" ? searchParams.q : "";
  const category = typeof searchParams?.category === "string" ? searchParams.category : "";
  const sort = typeof searchParams?.sort === "string" ? searchParams.sort : "featured";

  const { products, categories } = await getProductsCatalog({ q, category });

  return (
    <main className="products-page-root">
      <section className="products-page-head">
        <div className="products-page-shell">
          <p className="section-kicker">Products Catalog</p>
          <h1>Explore all InDev products</h1>
          <p>Find the right product faster with side filters, search, and sort controls.</p>
        </div>
      </section>

      <section className="products-catalog-wrap">
        <div className="products-page-shell products-catalog-layout">
          <aside className="products-filters-panel">
            <div className="products-filters-head">
              <strong>Filters</strong>
              <span>{products.length} items</span>
            </div>

            <form className="products-filter-form" action="/products" method="get">
              <input
                className="products-page-input"
                name="q"
                defaultValue={q}
                placeholder="Search products"
              />

              <div className="products-filter-block">
                <p>Category</p>
                <select className="products-page-select" name="category" defaultValue={category}>
                  <option value="">All categories</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="products-filter-block">
                <p>Sort</p>
                <select className="products-page-select" name="sort" defaultValue={sort}>
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              <button className="products-page-btn" type="submit">
                Apply Filters
              </button>
            </form>
          </aside>

          <div className="products-catalog-main">
            <div className="products-catalog-toolbar">
              <p>
                Showing <strong>{products.length}</strong> products
                {category ? ` in ${category}` : ""}
              </p>

              <form action="/products" method="get" className="products-sort-inline">
                <input type="hidden" name="q" value={q} />
                <input type="hidden" name="category" value={category} />
                <label>
                  Sort by
                  <select className="products-page-select" name="sort" defaultValue={sort}>
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </label>
              </form>
            </div>

            <PurchaseAwareProductsGrid products={products} sort={sort} />
          </div>
        </div>
      </section>

      <section className="products-custom-cta-wrap">
        <div className="products-page-shell">
          <div className="products-custom-cta-card">
            <p className="section-kicker">Custom Project</p>
            <h2>Need something tailored beyond the catalog?</h2>
            <p>
              Share your product requirements and we can design and build a custom solution around your exact use
              case.
            </p>

            <div className="products-custom-cta-actions">
              <a href="/contact" className="products-custom-cta-btn products-custom-cta-btn-primary">
                Contact Us
              </a>
              <a href="/contact" className="products-custom-cta-btn products-custom-cta-btn-secondary">
                Book a Call
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
