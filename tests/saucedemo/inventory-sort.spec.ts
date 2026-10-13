import { test } from '../../fixtures/auth.fixture';
import { inventorySort } from '../../data/inventory-sort';

test.describe('Sauce Demo — inventory sort', () => {
  test('sort products by name (A to Z)', async ({ standardInventory }) => {
    await standardInventory.sortBy(inventorySort.nameAsc);
    await standardInventory.expectNamesSorted('asc');
  });

  test('sort products by name (Z to A)', async ({ standardInventory }) => {
    await standardInventory.sortBy(inventorySort.nameDesc);
    await standardInventory.expectNamesSorted('desc');
  });

  test('sort products by price (low to high)', async ({ standardInventory }) => {
    await standardInventory.sortBy(inventorySort.priceLowHigh);
    await standardInventory.expectPricesSorted('asc');
  });

  test('sort products by price (high to low)', async ({ standardInventory }) => {
    await standardInventory.sortBy(inventorySort.priceHighLow);
    await standardInventory.expectPricesSorted('desc');
  });
});
