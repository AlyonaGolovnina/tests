import { useCallback, useEffect, useState } from 'react';
import { clearSession, readSession, writeSession } from './auth/session';
import { addOneToCart, removeOneFromCart } from './cart/mutations';
import { clearCartStorage, readCart, writeCart } from './cart/storage';
import type { CartQuantities } from './cart/types';
import { totalItems } from './cart/types';
import type { ShopView } from './components/ShopShell';
import { DEMO_USERNAME } from './data/demoAuth';
import { LoginPage } from './pages/LoginPage';
import { ShopPage } from './pages/ShopPage';
import {
  clearShopUi,
  defaultCheckoutUi,
  readCheckoutUi,
  readShopView,
  writeCheckoutUi,
  writeShopView,
  type CheckoutUiState,
} from './shop/uiStorage';

function loadCheckoutUi(
  username: string,
  quantities: CartQuantities,
): CheckoutUiState {
  const ui = readCheckoutUi(username);
  if (ui.orderPlaced) {
    return ui;
  }
  if (totalItems(quantities) === 0) {
    return defaultCheckoutUi;
  }
  return ui;
}

export function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<ShopView>('catalog');
  const [quantities, setQuantities] = useState<CartQuantities>({});
  const [checkoutUi, setCheckoutUi] = useState<CheckoutUiState>(defaultCheckoutUi);

  useEffect(() => {
    const session = readSession();
    if (session?.username === DEMO_USERNAME) {
      const savedCart = readCart(session.username);
      setUsername(session.username);
      setQuantities(savedCart);
      setView(readShopView(session.username));
      setCheckoutUi(loadCheckoutUi(session.username, savedCart));
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!username) {
      return;
    }
    writeCheckoutUi(username, checkoutUi);
  }, [username, checkoutUi]);

  const updateCart = useCallback(
    (updater: (prev: CartQuantities) => CartQuantities) => {
      setQuantities((prev) => {
        const next = updater(prev);
        if (username) {
          writeCart(username, next);
        }
        if (totalItems(next) === 0 && !checkoutUi.orderPlaced) {
          setCheckoutUi(defaultCheckoutUi);
        }
        return next;
      });
    },
    [username, checkoutUi.orderPlaced],
  );

  const navigate = useCallback(
    (nextView: ShopView) => {
      setView(nextView);
      if (username) {
        writeShopView(username, nextView);
      }
    },
    [username],
  );

  function handleLoginSuccess(loggedInUsername: string): void {
    writeSession({ username: loggedInUsername });
    const savedCart = readCart(loggedInUsername);
    const savedView = readShopView(loggedInUsername);
    const savedCheckout = loadCheckoutUi(loggedInUsername, savedCart);
    setUsername(loggedInUsername);
    setQuantities(savedCart);
    setView(savedView);
    setCheckoutUi(savedCheckout);
    writeCart(loggedInUsername, savedCart);
    writeShopView(loggedInUsername, savedView);
    writeCheckoutUi(loggedInUsername, savedCheckout);
  }

  function handleLogout(): void {
    if (username) {
      clearCartStorage(username);
      clearShopUi(username);
    }
    clearSession();
    setUsername(null);
    setQuantities({});
    setView('catalog');
    setCheckoutUi(defaultCheckoutUi);
  }

  function handleGoToCatalog(): void {
    setCheckoutUi(defaultCheckoutUi);
    if (username) {
      writeCheckoutUi(username, defaultCheckoutUi);
    }
    navigate('catalog');
  }

  const addOne = useCallback(
    (productId: string) => {
      updateCart((prev) => addOneToCart(prev, productId));
    },
    [updateCart],
  );

  const removeOne = useCallback(
    (productId: string) => {
      updateCart((prev) => removeOneFromCart(prev, productId));
    },
    [updateCart],
  );

  const clearCart = useCallback(() => {
    updateCart(() => ({}));
  }, [updateCart]);

  const handleCheckoutUiChange = useCallback((next: CheckoutUiState) => {
    setCheckoutUi(next);
  }, []);

  if (!ready) {
    return (
      <div className="app-loading" data-testid="app-loading" aria-busy="true">
        Загрузка…
      </div>
    );
  }

  if (username === null) {
    return <LoginPage onSuccess={handleLoginSuccess} />;
  }

  return (
    <ShopPage
      username={username}
      view={view}
      quantities={quantities}
      checkoutUi={checkoutUi}
      onCheckoutUiChange={handleCheckoutUiChange}
      onLogout={handleLogout}
      onNavigate={navigate}
      onGoToCatalog={handleGoToCatalog}
      onAddOne={addOne}
      onRemoveOne={removeOne}
      onClearCart={clearCart}
    />
  );
}
