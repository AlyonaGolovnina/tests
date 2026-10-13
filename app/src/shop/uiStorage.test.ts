import { describe, expect, it, beforeEach } from 'vitest';
import {
  clearShopUi,
  defaultCheckoutUi,
  readCheckoutUi,
  readShopView,
  writeCheckoutUi,
  writeShopView,
} from './uiStorage';

const user = 'QA_user';

describe('shop UI storage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('по умолчанию открывает каталог', () => {
    expect(readShopView(user)).toBe('catalog');
  });

  it('сохраняет экран корзины', () => {
    writeShopView(user, 'cart');
    expect(readShopView(user)).toBe('cart');
  });

  it('сохраняет черновик оформления заказа', () => {
    const draft = {
      showCheckout: true,
      address: 'ул. Пример, 5',
      phone: '+7 900 111-22-33',
      orderPlaced: false,
    };
    writeCheckoutUi(user, draft);
    expect(readCheckoutUi(user)).toEqual(draft);
  });

  it('возвращает дефолт при битых данных', () => {
    sessionStorage.setItem(
      `qa-coffee-shop-checkout:${user}`,
      'not-json',
    );
    expect(readCheckoutUi(user)).toEqual(defaultCheckoutUi);
  });

  it('очищает UI-состояние пользователя', () => {
    writeShopView(user, 'cart');
    writeCheckoutUi(user, { ...defaultCheckoutUi, showCheckout: true });
    clearShopUi(user);
    expect(readShopView(user)).toBe('catalog');
    expect(readCheckoutUi(user)).toEqual(defaultCheckoutUi);
  });
});
