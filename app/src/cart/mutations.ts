import type { CartQuantities } from './types';

export function addOneToCart(
  quantities: CartQuantities,
  productId: string,
): CartQuantities {
  return {
    ...quantities,
    [productId]: (quantities[productId] ?? 0) + 1,
  };
}

export function removeOneFromCart(
  quantities: CartQuantities,
  productId: string,
): CartQuantities {
  const current = quantities[productId] ?? 0;
  if (current <= 1) {
    const next = { ...quantities };
    delete next[productId];
    return next;
  }
  return { ...quantities, [productId]: current - 1 };
}
