import { useCallback, useEffect, useState } from 'react';
import { clearSession, readSession, writeSession } from './auth/session';
import { addOneToCart, removeOneFromCart } from './cart/mutations';
import { clearCartStorage, readCart, writeCart } from './cart/storage';
import type { CartQuantities } from './cart/types';
import type { ShopView } from './components/ShopShell';
import { DEMO_USERNAME } from './data/demoAuth';
import { LoginPage } from './pages/LoginPage';
import { ShopPage } from './pages/ShopPage';

export function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<ShopView>('catalog');
  const [quantities, setQuantities] = useState<CartQuantities>({});

  useEffect(() => {
    const session = readSession();
    if (session?.username === DEMO_USERNAME) {
      setUsername(session.username);
      setQuantities(readCart(session.username));
    }
    setReady(true);
  }, []);

  const updateCart = useCallback(
    (updater: (prev: CartQuantities) => CartQuantities) => {
      setQuantities((prev) => {
        const next = updater(prev);
        if (username) {
          writeCart(username, next);
        }
        return next;
      });
    },
    [username],
  );

  function handleLoginSuccess(loggedInUsername: string): void {
    writeSession({ username: loggedInUsername });
    const savedCart = readCart(loggedInUsername);
    setUsername(loggedInUsername);
    setQuantities(savedCart);
    writeCart(loggedInUsername, savedCart);
    setView('catalog');
  }

  function handleLogout(): void {
    if (username) {
      clearCartStorage(username);
    }
    clearSession();
    setUsername(null);
    setQuantities({});
    setView('catalog');
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
      onLogout={handleLogout}
      onNavigate={setView}
      onAddOne={addOne}
      onRemoveOne={removeOne}
      onClearCart={clearCart}
    />
  );
}
