import { Selector } from 'testcafe';

class MyCardsPage {
  constructor() {
    this.pageId = '#list-user-cards-nav';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const myCardsPage = new MyCardsPage();
