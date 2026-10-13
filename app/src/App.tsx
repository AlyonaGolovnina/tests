import { useEffect, useState } from 'react';
import { clearSession, readSession, writeSession } from './auth/session';
import { DEMO_USERNAME } from './data/demoAuth';
import { LoginPage } from './pages/LoginPage';
import { ShopPage } from './pages/ShopPage';

export function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = readSession();
    if (session?.username === DEMO_USERNAME) {
      setUsername(session.username);
    }
    setReady(true);
  }, []);

  function handleLoginSuccess(loggedInUsername: string): void {
    writeSession({ username: loggedInUsername });
    setUsername(loggedInUsername);
  }

  function handleLogout(): void {
    clearSession();
    setUsername(null);
  }

  if (!ready) {
    return null;
  }

  if (username === null) {
    return <LoginPage onSuccess={handleLoginSuccess} />;
  }

  return <ShopPage username={username} onLogout={handleLogout} />;
}
