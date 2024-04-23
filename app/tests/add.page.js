import { Selector } from 'testcafe';

class AddPage {
  constructor() {
    this.pageId = '#add-card-admin-nav';
    this.pageSelector = Selector(this.pageId);
    // this.submitButton = Selector('#add-submit');
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async add(testController, name, course, semester, department, email, image, facts, campuseats, hiddentalent) {
    await this.isDisplayed(testController);
    await testController.typeText('#name', name);
    await testController.typeText('#course', course);
    await testController.typeText('#semester', semester);
    await testController.typeText('#department', department);
    await testController.typeText('#email', email);
    await testController.typeText('#image', image);
    await testController.typeText('#facts', facts);
    await testController.typeText('#campuseats', campuseats);
    await testController.typeText('#hiddentalent', hiddentalent);
    await testController.click('#add-submit input.btn.btn-primary');
    await testController.pressKey('enter');

  }
}

export const addPage = new AddPage();
