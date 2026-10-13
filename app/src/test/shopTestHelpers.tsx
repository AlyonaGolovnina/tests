import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';
import { DEMO_PASSWORD, DEMO_USERNAME } from '../data/demoAuth';

export async function renderApp() {
  const user = userEvent.setup();
  const view = render(<App />);
  await waitFor(() => {
    const ready =
      screen.queryByTestId('login-page') ??
      screen.queryByTestId('product-catalog') ??
      screen.queryByTestId('cart-page');
    expect(ready).toBeTruthy();
  });
  return { user, ...view };
}

export async function loginWithDemoUser(user: ReturnType<typeof userEvent.setup>) {
  if (!screen.queryByTestId('login-page')) {
    return;
  }
  await user.type(screen.getByTestId('login-username'), DEMO_USERNAME);
  await user.type(screen.getByTestId('login-password'), DEMO_PASSWORD);
  await user.click(screen.getByTestId('login-submit'));
  await screen.findByTestId('product-catalog');
}

export async function loginAs(
  user: ReturnType<typeof userEvent.setup>,
  username: string,
  password: string,
) {
  await user.type(screen.getByTestId('login-username'), username);
  await user.type(screen.getByTestId('login-password'), password);
  await user.click(screen.getByTestId('login-submit'));
}

export function firstProductId(): string {
  return 'notebook';
}

export async function addProductToCart(
  user: ReturnType<typeof userEvent.setup>,
  productId = firstProductId(),
) {
  await user.click(screen.getByTestId(`add-to-cart-${productId}`));
  await screen.findByTestId(`cart-quantity-${productId}`);
}

export async function openCart(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('cart-status'));
  await screen.findByTestId('cart-page');
}

export function cartStatusLabel(): HTMLElement {
  return screen.getByTestId('cart-status');
}

export function catalogLink(): HTMLElement {
  return screen.getByTestId('site-title');
}

export async function goToCatalogFromTitle(user: ReturnType<typeof userEvent.setup>) {
  await user.click(catalogLink());
  await screen.findByTestId('product-catalog');
}

export async function placeOrder(
  user: ReturnType<typeof userEvent.setup>,
  address = 'ул. Тестовая, 1',
  phone = '+7 900 000-00-00',
) {
  if (!screen.queryByTestId('checkout-form')) {
    await user.click(screen.getByTestId('checkout-button'));
  }
  const form = screen.getByTestId('checkout-form');
  await user.type(within(form).getByTestId('checkout-address'), address);
  await user.type(within(form).getByTestId('checkout-phone'), phone);
  await user.click(within(form).getByTestId('checkout-submit'));
  await screen.findByTestId('checkout-success');
}
