import type { CartQuantities } from './types';

function cartKey(username: string): string {
  return `qa-coffee-shop-cart:${username}`;
}

export function readCart(username: string): CartQuantities {
  try {
    const raw = sessionStorage.getItem(cartKey(username));
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as CartQuantities;
    if (parsed === null || typeof parsed !== 'object') {
      return {};
    }
    const next: CartQuantities = {};
    for (const [id, qty] of Object.entries(parsed)) {
      if (typeof qty === 'number' && qty > 0 && Number.isInteger(qty)) {
        next[id] = qty;
      }
    }
    return next;
  } catch {
    return {};
  }
}

export function writeCart(username: string, quantities: CartQuantities): void {
  sessionStorage.setItem(cartKey(username), JSON.stringify(quantities));
}

export function clearCartStorage(username: string): void {
  sessionStorage.removeItem(cartKey(username));
}
