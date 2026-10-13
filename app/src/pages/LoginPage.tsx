import { useState, type FormEvent } from 'react';
import {
  DEMO_PASSWORD,
  DEMO_USERNAME,
  isValidCredentials,
} from '../data/demoAuth';

type LoginPageProps = {
  onSuccess: (username: string) => void;
};

export function LoginPage({ onSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setError(null);

    if (!isValidCredentials(username, password)) {
      setError('Неверный логин или пароль');
      return;
    }

    onSuccess(username);
  }

  return (
    <div className="page page--auth">
      <div className="auth-layout">
      <main className="auth-card" data-testid="login-page">
        <h1 data-testid="login-title">Вход</h1>
        <p className="auth-lead" data-testid="login-lead">
          QA Coffee Shop — учебная авторизация без бэкенда
        </p>

        <form
          className="auth-form"
          data-testid="login-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <label className="auth-field">
            <span className="auth-label">Логин</span>
            <input
              type="text"
              name="username"
              className="auth-input"
              data-testid="login-username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>

          <label className="auth-field">
            <span className="auth-label">Пароль</span>
            <input
              type="password"
              name="password"
              className="auth-input"
              data-testid="login-password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? (
            <p className="auth-error" data-testid="login-error" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="cart-toggle auth-submit"
            data-testid="login-submit"
          >
            Войти
          </button>
        </form>
      </main>

      <aside
        className="auth-demo"
        data-testid="login-demo-credentials"
        aria-label="Демо-доступ для проверки"
      >
        <p className="auth-demo__title">Демо-доступ</p>
        <dl className="auth-demo__list">
          <div className="auth-demo__row">
            <dt>Логин</dt>
            <dd data-testid="login-demo-username">{DEMO_USERNAME}</dd>
          </div>
          <div className="auth-demo__row">
            <dt>Пароль</dt>
            <dd data-testid="login-demo-password">{DEMO_PASSWORD}</dd>
          </div>
        </dl>
      </aside>
      </div>
    </div>
  );
}
