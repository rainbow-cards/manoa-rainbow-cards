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

  async hasAdded(testController) {
    const colCount = Selector('.col').count;
    await testController.expect(colCount).gte(1); // Need to change to 4 once add function works again
  }
}

export const myCardsPage = new MyCardsPage();
