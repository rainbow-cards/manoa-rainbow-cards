import { Selector } from 'testcafe';

class CatalogPage {
  constructor() {
    this.pageId = '#catalog-nav';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Asserts that this page has greater than or equal to 4 cards displayed */
  /** Notice, the default (from a meteor reset) amount of cards is 3 */
  async hasAdded(testController) {
    const colCount = Selector('.col').count;
    await testController.expect(colCount).gte(4); // Need to change to 4 once add function works again
  }

  async wish(testController) {
    await testController.click(Selector('.card').nth(1));
    await testController.pressKey('tab');
    await testController.pressKey('enter');
    // await testController.click(Selector('.button').nth(0));
    // await testController.click('#wish-button');
  }

  async hasWished(testController) {
    const colCount = Selector('.card').count;
    await testController.expect(colCount).gte(1);

  }
}

export const catalogPage = new CatalogPage();
