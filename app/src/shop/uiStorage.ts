import type { ShopView } from '../components/ShopShell';

export type CheckoutUiState = {
  showCheckout: boolean;
  address: string;
  phone: string;
  orderPlaced: boolean;
};

export const defaultCheckoutUi: CheckoutUiState = {
  showCheckout: false,
  address: '',
  phone: '',
  orderPlaced: false,
};

function storageKey(username: string, suffix: string): string {
  return `qa-coffee-shop-${suffix}:${username}`;
}

export function readShopView(username: string): ShopView {
  const raw = sessionStorage.getItem(storageKey(username, 'view'));
  return raw === 'cart' ? 'cart' : 'catalog';
}

export function writeShopView(username: string, view: ShopView): void {
  sessionStorage.setItem(storageKey(username, 'view'), view);
}

export function readCheckoutUi(username: string): CheckoutUiState {
  try {
    const raw = sessionStorage.getItem(storageKey(username, 'checkout'));
    if (!raw) {
      return defaultCheckoutUi;
    }
    const parsed = JSON.parse(raw) as Partial<CheckoutUiState>;
    return {
      showCheckout: parsed.showCheckout === true,
      address: typeof parsed.address === 'string' ? parsed.address : '',
      phone: typeof parsed.phone === 'string' ? parsed.phone : '',
      orderPlaced: parsed.orderPlaced === true,
    };
  } catch {
    return defaultCheckoutUi;
  }
}

export function writeCheckoutUi(username: string, state: CheckoutUiState): void {
  sessionStorage.setItem(storageKey(username, 'checkout'), JSON.stringify(state));
}

export function clearShopUi(username: string): void {
  sessionStorage.removeItem(storageKey(username, 'view'));
  sessionStorage.removeItem(storageKey(username, 'checkout'));
}
