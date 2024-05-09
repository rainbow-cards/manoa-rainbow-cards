import { Selector } from 'testcafe';

class WishlistPage {
  constructor() {
    this.pageId = '#wish-nav';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
    await testController.click(Selector('.card').nth(1));
    await testController.pressKey('tab');
    await testController.pressKey('enter');
  }
}

export const wishlistPage = new WishlistPage();
