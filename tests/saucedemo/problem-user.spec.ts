import { test, expect } from '../../fixtures/auth.fixture';
import { products } from '../../data/products';

test.describe('Sauce Demo — problem_user', () => {
  test('sees the full product catalog', async ({ problemInventory }) => {
    await expect(problemInventory.itemNames).toHaveCount(6);
  });

  test('shows product image defect (broken or wrong image)', async ({
    problemInventory,
  }) => {
    await problemInventory.expectProblemUserImageDefect();
  });

  test('can still add a product to the cart', async ({ problemInventory }) => {
    await problemInventory.addToCart(products.backpack);
    await problemInventory.expectCartBadgeCount(1);
  });
});
