import { test, expect } from '../../fixtures/auth.fixture';
import { products } from '../../data/products';
import { inventorySort } from '../../data/inventory-sort';
import { checkoutCustomer } from '../../data/checkout';
import { errorUserMessages } from '../../data/error-user';
import { CheckoutOverviewPage } from '../../pages/checkout-overview.page';

test.describe('Sauce Demo — error_user', () => {
  test.describe('inventory', () => {
    test('shows the full product catalog', async ({ errorInventory }) => {
      await expect(errorInventory.itemNames).toHaveCount(6);
    });

    test('sort by price shows alert and does not change order', async ({
      errorInventory,
    }) => {
      const pricesBefore = await errorInventory.getProductPrices();

      const alertMessage = await errorInventory.sortByAndCaptureAlert(
        inventorySort.priceLowHigh,
      );

      expect(alertMessage).toBe(errorUserMessages.brokenSortAlert);
      await expect(errorInventory.itemPrices.first()).toHaveText(
        `$${pricesBefore[0].toFixed(2)}`,
      );
      expect(await errorInventory.getProductPrices()).toEqual(pricesBefore);
    });

    test('can add backpack to the cart', async ({ errorInventory }) => {
      await errorInventory.addToCart(products.backpack);
      await errorInventory.expectCartBadgeCount(1);
    });

    test('cannot add fleece jacket to the cart', async ({ errorInventory }) => {
      const pageErrors: string[] = [];
      errorInventory.page.on('pageerror', (error) =>
        pageErrors.push(error.message),
      );

      await errorInventory.addToCart(products.fleeceJacket);

      await expect(errorInventory.cartBadge).toHaveCount(0);
      await expect.poll(() => pageErrors.length).toBeGreaterThan(0);
      expect(
        pageErrors.some((message) =>
          message.includes(errorUserMessages.addToCartFailure),
        ),
      ).toBe(true);
    });
  });

  test.describe('checkout', () => {
    test('last name field does not accept input', async ({ errorCheckoutInfo }) => {
      await errorCheckoutInfo.expectLastNameInputIgnoresTyping(
        checkoutCustomer.lastName,
      );
    });

    test('continues to overview without last-name validation banner', async ({
      errorCheckoutInfo,
    }) => {
      const checkoutOverviewPage = new CheckoutOverviewPage(
        errorCheckoutInfo.page,
      );

      await errorCheckoutInfo.firstNameInput.fill(checkoutCustomer.firstName);
      await errorCheckoutInfo.postalCodeInput.fill(checkoutCustomer.postalCode);
      await errorCheckoutInfo.expectLastNameInputIgnoresTyping(
        checkoutCustomer.lastName,
      );
      await errorCheckoutInfo.expectNoErrorBanner();
      await errorCheckoutInfo.continue();

      await checkoutOverviewPage.expectLoaded();
    });

    test('finish order fails and stays on overview step', async ({
      errorCheckoutInfo,
    }) => {
      const checkoutOverviewPage = new CheckoutOverviewPage(
        errorCheckoutInfo.page,
      );
      const pageErrors: string[] = [];
      errorCheckoutInfo.page.on('pageerror', (error) =>
        pageErrors.push(error.message),
      );

      await errorCheckoutInfo.firstNameInput.fill(checkoutCustomer.firstName);
      await errorCheckoutInfo.postalCodeInput.fill(checkoutCustomer.postalCode);
      await errorCheckoutInfo.continue();
      await checkoutOverviewPage.expectLoaded();

      await checkoutOverviewPage.finishOrder();

      await expect(errorCheckoutInfo.page).toHaveURL(/checkout-step-two\.html/);
      await expect(errorCheckoutInfo.page.getByTestId('complete-header')).toHaveCount(0);
      await expect.poll(() => pageErrors.length).toBeGreaterThan(0);
    });
  });
});
