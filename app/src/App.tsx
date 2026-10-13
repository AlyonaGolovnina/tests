import { useMemo, useState } from 'react';
import { products } from './data/products';

export function App() {
  const [cartCount, setCartCount] = useState(0);

  const cartLabel = useMemo(
    () => (cartCount === 0 ? 'Корзина пуста' : `В корзине: ${cartCount}`),
    [cartCount],
  );

  return (
    <div className="page">
      <header className="header" data-testid="site-header">
        <h1 data-testid="site-title">QA Portfolio Shop</h1>
        <p className="tagline" data-testid="site-tagline">
          Учебная витрина для E2E-тестов (GitHub Pages)
        </p>
        <p className="cart-status" data-testid="cart-status" aria-live="polite">
          {cartLabel}
        </p>
      </header>

      <main className="catalog" data-testid="product-catalog">
        {products.map((product) => (
          <article
            key={product.id}
            className="card"
            data-testid={`product-card-${product.id}`}
          >
            <h2 data-testid="product-name">{product.name}</h2>
            <p className="price" data-testid="product-price">
              {product.priceLabel}
            </p>
            <p className="desc">{product.description}</p>
            <button
              type="button"
              data-testid={`add-to-cart-${product.id}`}
              onClick={() => setCartCount((count) => count + 1)}
            >
              В корзину
            </button>
          </article>
        ))}
      </main>

      <footer className="footer" data-testid="site-footer">
        Pet-project · Playwright · AlyonaGolovnina/tests
      </footer>
    </div>
  );
}
