import type { Product } from '../data/products';
import { products } from '../data/products';
import type { CartQuantities } from './types';

export type CartLine = {
  product: Product;
  quantity: number;
};

export function getCartLines(quantities: CartQuantities): CartLine[] {
  return products
    .map((product) => ({
      product,
      quantity: quantities[product.id] ?? 0,
    }))
    .filter((line) => line.quantity > 0);
}

export function cartTotalRub(quantities: CartQuantities): number {
  return getCartLines(quantities).reduce(
    (sum, line) => sum + line.product.priceRub * line.quantity,
    0,
  );
}
