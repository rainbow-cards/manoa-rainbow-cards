import { Selector } from 'testcafe';

class DevTestPage {
  constructor() {
    this.pageId = '#devtest-admin-nav';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async devTestAdd(testController) {
    const item = Selector('option').nth(1);
    await this.isDisplayed(testController);
    await testController.click('#selectField');
    await testController.click(item);
    await testController.typeText('#enterUser', 'admin@foo.com');
    await testController.click('#submit input.btn.btn-primary');
    await testController.pressKey('enter');
  }
}

export const devTestPage = new DevTestPage();
