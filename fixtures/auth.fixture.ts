import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { users } from '../data/users';
import { products } from '../data/products';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutInformationPage } from '../pages/checkout-information.page';

type UserCredentials = {
  username: string;
  password: string;
};

async function loginAndOpenInventory(
  page: Page,
  user: UserCredentials,
): Promise<InventoryPage> {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(user.username, user.password);
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.expectLoaded();
  return inventoryPage;
}

type AuthFixtures = {
  /** Logged in as standard_user on the inventory page */
  standardInventory: InventoryPage;
  /** Logged in as problem_user on the inventory page */
  problemInventory: InventoryPage;
  /** Logged in as error_user on the inventory page */
  errorInventory: InventoryPage;
  /** error_user with backpack in cart, on checkout step one */
  errorCheckoutInfo: CheckoutInformationPage;
};

export const test = base.extend<AuthFixtures>({
  standardInventory: async ({ page }, use) => {
    await use(await loginAndOpenInventory(page, users.standard));
  },

  problemInventory: async ({ page }, use) => {
    await use(await loginAndOpenInventory(page, users.problem));
  },

  errorInventory: async ({ page }, use) => {
    await use(await loginAndOpenInventory(page, users.error));
  },

  errorCheckoutInfo: async ({ errorInventory }, use) => {
    const cartPage = new CartPage(errorInventory.page);
    const checkoutInfoPage = new CheckoutInformationPage(errorInventory.page);

    await errorInventory.addToCart(products.backpack);
    await errorInventory.openCart();
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.expectLoaded();

    await use(checkoutInfoPage);
  },
});

export { expect };
