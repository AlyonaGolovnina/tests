import { describe, expect, it, beforeEach } from 'vitest';
import { clearSession, readSession, writeSession } from './session';

describe('session storage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('сохраняет и читает сессию', () => {
    writeSession({ username: 'QA_user' });
    expect(readSession()).toEqual({ username: 'QA_user' });
  });

  it('возвращает null, если сессии нет', () => {
    expect(readSession()).toBeNull();
  });

  it('очищает сессию', () => {
    writeSession({ username: 'QA_user' });
    clearSession();
    expect(readSession()).toBeNull();
  });

  it('игнорирует битый JSON', () => {
    sessionStorage.setItem('qa-coffee-shop-session', '{not-json');
    expect(readSession()).toBeNull();
  });

  it('игнорирует пустое имя пользователя', () => {
    sessionStorage.setItem('qa-coffee-shop-session', JSON.stringify({ username: '' }));
    expect(readSession()).toBeNull();
  });
});
