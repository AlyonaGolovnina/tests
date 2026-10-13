import { test } from '../../fixtures/auth.fixture';
import { productNames, products } from '../../data/products';
import { checkoutCustomer } from '../../data/checkout';
import { CartPage } from '../../pages/cart.page';
import { CheckoutInformationPage } from '../../pages/checkout-information.page';
import { CheckoutOverviewPage } from '../../pages/checkout-overview.page';
import { CheckoutCompletePage } from '../../pages/checkout-complete.page';

test.describe('Sauce Demo — checkout', () => {
  test('complete order for one product', async ({ standardInventory }) => {
    const page = standardInventory.page;
    const cartPage = new CartPage(page);
    const checkoutInfoPage = new CheckoutInformationPage(page);
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    const checkoutCompletePage = new CheckoutCompletePage(page);

    await standardInventory.addToCart(products.backpack);
    await standardInventory.openCart();
    await cartPage.expectLoaded();
    await cartPage.expectItems([productNames.backpack]);
    await cartPage.proceedToCheckout();

    await checkoutInfoPage.expectLoaded();
    await checkoutInfoPage.fillCustomerInfo(checkoutCustomer);
    await checkoutInfoPage.continue();

    await checkoutOverviewPage.expectLoaded();
    await checkoutOverviewPage.finishOrder();

    await checkoutCompletePage.expectOrderComplete();
  });
});
