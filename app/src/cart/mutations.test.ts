import { describe, expect, it } from 'vitest';
import { addOneToCart, removeOneFromCart } from './mutations';

describe('cart mutations', () => {
  it('добавляет первую позицию', () => {
    expect(addOneToCart({}, 'notebook')).toEqual({ notebook: 1 });
  });

  it('увеличивает количество', () => {
    expect(addOneToCart({ notebook: 2 }, 'notebook')).toEqual({ notebook: 3 });
  });

  it('удаляет позицию при уменьшении с 1 до 0', () => {
    expect(removeOneFromCart({ notebook: 1 }, 'notebook')).toEqual({});
  });

  it('уменьшает количество, если больше 1', () => {
    expect(removeOneFromCart({ notebook: 3 }, 'notebook')).toEqual({ notebook: 2 });
  });

  it('не ломается на неизвестном id', () => {
    expect(removeOneFromCart({}, 'missing')).toEqual({});
  });
});
