import { expect, type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly sortSelect: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly productImages: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.sortSelect = page.getByTestId('product-sort-container');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.productImages = page
      .getByRole('button', { name: /^View details for / })
      .getByRole('img');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.sortSelect).toBeVisible();
  }

  async addToCart(productTestId: string): Promise<void> {
    await this.page.getByTestId(productTestId).click();
  }

  async expectCartBadgeCount(count: number): Promise<void> {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async sortBy(optionValue: string): Promise<void> {
    await this.sortSelect.selectOption(optionValue);
  }

  async sortByAndCaptureAlert(optionValue: string): Promise<string> {
    let message = '';
    this.page.once('dialog', async (dialog) => {
      message = dialog.message();
      await dialog.dismiss();
    });
    await this.sortSelect.selectOption(optionValue, { force: true });
    await expect.poll(() => message).not.toBe('');
    return message;
  }

  async getProductNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((price) => Number.parseFloat(price.replace('$', '')));
  }

  async expectNamesSorted(order: 'asc' | 'desc'): Promise<void> {
    const names = await this.getProductNames();
    const expected = [...names].sort((a, b) =>
      order === 'asc' ? a.localeCompare(b) : b.localeCompare(a),
    );
    expect(names).toEqual(expected);
  }

  async expectPricesSorted(order: 'asc' | 'desc'): Promise<void> {
    const prices = await this.getProductPrices();
    const expected = [...prices].sort((a, b) =>
      order === 'asc' ? a - b : b - a,
    );
    expect(prices).toEqual(expected);
  }

  /**
   * problem_user: broken thumbnails and/or wrong image reused across products.
   */
  async expectProblemUserImageDefect(): Promise<void> {
    await expect(this.productImages.first()).toBeVisible();
    const count = await this.productImages.count();
    expect(count).toBeGreaterThan(1);

    await expect(async () => {
      const imageStates = await this.productImages.evaluateAll((images) =>
        images.map((img) => ({
          broken:
            img.complete && (img as HTMLImageElement).naturalWidth === 0,
          src: (img as HTMLImageElement).currentSrc,
        })),
      );

      const anyBroken = imageStates.some((state) => state.broken);
      const uniqueSrcCount = new Set(imageStates.map((state) => state.src))
        .size;
      const reusedAcrossCatalog = uniqueSrcCount < imageStates.length;

      expect(anyBroken || reusedAcrossCatalog).toBe(true);
    }).toPass();
  }
}
