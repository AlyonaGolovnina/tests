export type CartQuantities = Record<string, number>;

export function totalItems(quantities: CartQuantities): number {
  return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
}
