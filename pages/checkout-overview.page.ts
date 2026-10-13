import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutOverviewPage {
  readonly page: Page;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly summaryInfo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.finishButton = page.getByTestId('finish');
    this.cancelButton = page.getByTestId('cancel');
    this.summaryInfo = page.getByTestId('payment-info-label');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-two\.html/);
    await expect(this.finishButton).toBeVisible();
    await expect(this.summaryInfo).toBeVisible();
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }
}
