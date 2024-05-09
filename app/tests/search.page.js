import { Selector } from 'testcafe';

class SearchPage {
  constructor() {
    this.pageId = '#search-nav';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async search(testController, name) {
    await this.isDisplayed(testController);
    await testController.typeText('#search-bar', name);
    await testController.click('#submit-button input.btn.btn-primary');
    await testController.pressKey('enter');

  }
}

export const searchPage = new SearchPage();
