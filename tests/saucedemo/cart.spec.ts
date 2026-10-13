import { test } from '../../fixtures/auth.fixture';
import { productNames, products } from '../../data/products';
import { CartPage } from '../../pages/cart.page';

test.describe('Sauce Demo — cart', () => {
  test('add one product and verify it in the cart', async ({ standardInventory }) => {
    const cartPage = new CartPage(standardInventory.page);

    await standardInventory.addToCart(products.backpack);
    await standardInventory.expectCartBadgeCount(1);
    await standardInventory.openCart();

    await cartPage.expectLoaded();
    await cartPage.expectItems([productNames.backpack]);
  });

  test('add two products and verify cart badge', async ({ standardInventory }) => {
    await standardInventory.addToCart(products.backpack);
    await standardInventory.addToCart(products.bikeLight);
    await standardInventory.expectCartBadgeCount(2);
  });
});
