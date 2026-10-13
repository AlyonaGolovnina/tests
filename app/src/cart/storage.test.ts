import { describe, expect, it, beforeEach } from 'vitest';
import { clearCartStorage, readCart, writeCart } from './storage';

const user = 'QA_user';

describe('cart storage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('сохраняет и восстанавливает количества', () => {
    writeCart(user, { notebook: 2, mug: 1 });
    expect(readCart(user)).toEqual({ notebook: 2, mug: 1 });
  });

  it('возвращает пустой объект без данных', () => {
    expect(readCart(user)).toEqual({});
  });

  it('отбрасывает невалидные количества', () => {
    sessionStorage.setItem(
      `qa-coffee-shop-cart:${user}`,
      JSON.stringify({ notebook: -1, mug: 1.5, stickers: 'x' }),
    );
    expect(readCart(user)).toEqual({});
  });

  it('очищает корзину пользователя', () => {
    writeCart(user, { notebook: 1 });
    clearCartStorage(user);
    expect(readCart(user)).toEqual({});
  });
});
