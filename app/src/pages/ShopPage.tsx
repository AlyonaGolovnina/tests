import { useMemo, useState } from 'react';
import { productImageUrl, products } from '../data/products';

type CartQuantities = Record<string, number>;

type ShopPageProps = {
  username: string;
  onLogout: () => void;
};

function totalItems(quantities: CartQuantities): number {
  return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
}

export function ShopPage({ username, onLogout }: ShopPageProps) {
  const [quantities, setQuantities] = useState<CartQuantities>({});

  const cartCount = totalItems(quantities);

  const cartLabel = useMemo(
    () => (cartCount === 0 ? 'Корзина пуста' : `В корзине: ${cartCount}`),
    [cartCount],
  );

  function getQuantity(productId: string): number {
    return quantities[productId] ?? 0;
  }

  function addOne(productId: string): void {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] ?? 0) + 1,
    }));
  }

  function removeOne(productId: string): void {
    setQuantities((prev) => {
      const current = prev[productId] ?? 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: current - 1 };
    });
  }

  return (
    <div className="page">
      <a className="skip-link" href="#product-catalog">
        К каталогу
      </a>
      <header className="header" data-testid="site-header">
        <div className="header-top">
          <h1 data-testid="site-title">QA Coffee Shop</h1>
          <div className="user-bar">
            <span className="user-name" data-testid="user-greeting">
              {username}
            </span>
            <button
              type="button"
              className="logout-btn"
              data-testid="logout-button"
              onClick={onLogout}
            >
              Выйти
            </button>
          </div>
        </div>
        <p className="tagline" data-testid="site-tagline">
          Учебная витрина для E2E-тестов (GitHub Pages)
        </p>
        <p className="cart-status" data-testid="cart-status" aria-live="polite">
          {cartLabel}
        </p>
      </header>

      <main
        id="product-catalog"
        className="catalog"
        data-testid="product-catalog"
      >
        {products.map((product) => {
          const quantity = getQuantity(product.id);
          const inCart = quantity > 0;

          return (
            <article
              key={product.id}
              className={`card${inCart ? ' card--in-cart' : ''}`}
              data-testid={`product-card-${product.id}`}
            >
              <div className="card-media">
                <img
                  src={productImageUrl(product.imageFile)}
                  alt={product.name}
                  className="card-image"
                  data-testid={`product-image-${product.id}`}
                  loading="lazy"
                  width={320}
                  height={240}
                />
              </div>
              <h2 data-testid="product-name">{product.name}</h2>
              <p className="price" data-testid="product-price">
                {product.priceLabel}
              </p>
              <p
                className="desc"
                data-testid={`product-description-${product.id}`}
              >
                {product.description}
              </p>
              {quantity === 0 ? (
                <button
                  type="button"
                  className="cart-toggle"
                  data-testid={`add-to-cart-${product.id}`}
                  onClick={() => addOne(product.id)}
                >
                  В корзину
                </button>
              ) : (
                <div
                  className="cart-stepper"
                  data-testid={`cart-controls-${product.id}`}
                >
                  <button
                    type="button"
                    className="cart-stepper__btn cart-stepper__btn--minus"
                    data-testid={`remove-from-cart-${product.id}`}
                    aria-label={`Уменьшить количество: ${product.name}`}
                    onClick={() => removeOne(product.id)}
                  >
                    −
                  </button>
                  <span
                    className="cart-stepper__qty"
                    data-testid={`cart-quantity-${product.id}`}
                    aria-live="polite"
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="cart-stepper__btn cart-stepper__btn--plus"
                    data-testid={`add-to-cart-${product.id}`}
                    aria-label={`Увеличить количество: ${product.name}`}
                    onClick={() => addOne(product.id)}
                  >
                    +
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </main>

      <footer className="footer" data-testid="site-footer">
        Pet-project · Playwright · AlyonaGolovnina/tests
      </footer>
    </div>
  );
}
