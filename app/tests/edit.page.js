import { Selector } from 'testcafe';

class EditPage {
  constructor() {
    this.pageId = '#catalog-admin-nav';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async edit(testController, name, course, semester, department, email, image, facts, campuseats, hiddentalent) {
    await this.isDisplayed(testController);
    await testController.click(Selector('.card').nth(3)); // this is the issue
    await testController.click('#admin-edit-link');
    await testController.typeText('#name', name, { replace: true });
    await testController.typeText('#course', course, { replace: true });
    await testController.typeText('#semester', semester, { replace: true });
    await testController.typeText('#department', department, { replace: true });
    await testController.typeText('#email', email, { replace: true });
    await testController.typeText('#image', image, { replace: true });
    await testController.typeText('#facts', facts, { replace: true });
    await testController.typeText('#campuseats', campuseats, { replace: true });
    await testController.typeText('#hiddentalent', hiddentalent, { replace: true });
    await testController.click('#edit-submit input.btn.btn-primary');
    await testController.pressKey('enter');
  }
}

export const editPage = new EditPage();
