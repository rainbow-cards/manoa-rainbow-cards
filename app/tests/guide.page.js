import { Selector } from 'testcafe';

class GuidePage {
  constructor() {
    this.pageId = '#guide-nav';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async getDevCard(testController) {
    await testController.click('#dev-card');
  }
}
export const guidePage = new GuidePage();
