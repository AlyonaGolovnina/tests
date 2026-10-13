import type { ReactNode } from 'react';
import { totalItems, type CartQuantities } from '../cart/types';

export type ShopView = 'catalog' | 'cart';

type ShopShellProps = {
  username: string;
  view: ShopView;
  quantities: CartQuantities;
  onLogout: () => void;
  onNavigate: (view: ShopView) => void;
  children: ReactNode;
};

export function ShopShell({
  username,
  view,
  quantities,
  onLogout,
  onNavigate,
  children,
}: ShopShellProps) {
  const cartCount = totalItems(quantities);

  const cartLabel =
    cartCount === 0 ? 'Корзина пуста' : `В корзине: ${cartCount}`;

  return (
    <div className="page">
      <header className="header" data-testid="site-header">
        <div className="header-top">
          <h1 className="site-title-wrap">
            <button
              type="button"
              className="site-title-btn"
              data-testid="site-title"
              onClick={() => onNavigate('catalog')}
            >
              QA Coffee Shop
            </button>
          </h1>
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
          Учебная витрина для тестов (GitHub Pages)
        </p>
        <button
          type="button"
          className={`cart-status${view === 'cart' ? ' cart-status--active' : ''}`}
          data-testid="cart-status"
          aria-live="polite"
          aria-current={view === 'cart' ? 'page' : undefined}
          onClick={() => onNavigate('cart')}
        >
          {cartLabel}
        </button>
      </header>

      {children}

      <footer className="footer" data-testid="site-footer">
        Pet-project · Playwright · AlyonaGolovnina/tests
      </footer>
    </div>
  );
}
