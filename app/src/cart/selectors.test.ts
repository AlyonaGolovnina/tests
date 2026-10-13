import { describe, expect, it } from 'vitest';
import { cartTotalRub, getCartLines } from './selectors';

describe('cart selectors', () => {
  it('строит строки только для товаров с количеством > 0', () => {
    const lines = getCartLines({ notebook: 2, mug: 0 });
    expect(lines).toHaveLength(1);
    expect(lines[0].product.id).toBe('notebook');
    expect(lines[0].quantity).toBe(2);
  });

  it('считает итог в рублях', () => {
    // notebook 130 + mug 199
    expect(cartTotalRub({ notebook: 1, mug: 1 })).toBe(329);
  });

  it('возвращает 0 для пустой корзины', () => {
    expect(cartTotalRub({})).toBe(0);
    expect(getCartLines({})).toEqual([]);
  });
});
