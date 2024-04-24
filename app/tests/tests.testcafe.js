import { landingPage } from './landing.page';
import { signinPage } from './signin.page';
import { signoutPage } from './signout.page';
import { navBar } from './navbar.component';
import { catalogPage } from './catalog.page';
import { myCardsPage } from './mycards.page';
import { addPage } from './add.page';
import { editPage } from './edit.page';
import { devTestPage } from './devtest.page';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'john@foo.com', password: 'changeme' };
const admin = { username: 'admin@foo.com', password: 'changeme' };
const prof = {
  name: 'Ravi Narayan',
  course: 'ICS451',
  semester: 'Fall 2024',
  department: 'ICS',
  email: 'rnarayan@hawaii.edu',
  image: 'https://www2.hawaii.edu/~rnarayan/Ravi_Narayan.jpg',
  facts: 'Excellent ballroom dancer',
  owner: 'john@foo.com',
  campus_eats: 'Ding Tea',
  hidden_talent: 'Vegetarian',
};
const sR = {
  name: 'Scott Robertson',
  course: 'ICS111',
  semester: 'Fall 2022',
  department: 'ICS',
  email: 'scottpr@hawaii.edu',
  image: 'https://www2.hawaii.edu/~scottpr/images/ScottRobertson500x500.jpg',
  facts: 'Professor and Chair of ICS Department',
  campus_eats: 'Brito Bowl',
  hidden_talent: 'Robertson',
};

// fixture('Mānoa Rainbow Cards deployment page test with default db')
//   .page('http://localhost:3000');

fixture('Mānoa Rainbow Cards deployment page test with default db')
  .page('https://manoa-rainbow-cards.xyz/');

test('Test that landing page shows up', async (testController) => {
  await landingPage.isDisplayed(testController);
});

test('Test that signin and signout work', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.isLoggedIn(testController, credentials.username);
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
});

test('Test that catalog and mycards work for generic accounts', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.isLoggedIn(testController, credentials.username);
  await navBar.gotoCatalogPage(testController);
  await catalogPage.isDisplayed(testController);
  await navBar.gotoMyCardsPage(testController);
  await myCardsPage.isDisplayed(testController);
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
});

test('Test that signin and signout work for admin accounts', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, admin.username, admin.password);
  await navBar.isLoggedIn(testController, admin.username);
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
});

test('Test that catalog and mycards work for admin accounts', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, admin.username, admin.password);
  await navBar.isLoggedIn(testController, admin.username);
  await navBar.gotoCatalogPage(testController);
  await catalogPage.isDisplayed(testController);
  await navBar.gotoMyCardsPage(testController);
  await myCardsPage.isDisplayed(testController);
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
});

test('Test that addprofessorcard page works for admin accounts', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, admin.username, admin.password);
  await navBar.isLoggedIn(testController, admin.username);
  await navBar.gotoAddPage(testController);
  await addPage.isDisplayed(testController);
  await addPage.add(
    testController,
    prof.name,
    prof.course,
    prof.semester,
    prof.department,
    prof.email,
    prof.image,
    prof.facts,
    prof.owner,
    prof.campus_eats,
    prof.hidden_talent,
  );
  await navBar.gotoCatalogPage(testController);
  await catalogPage.isDisplayed(testController);
  await catalogPage.hasAdded(testController);
  /*
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
  */
});

test('Test that editprofessorcard page works for admin accounts', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, admin.username, admin.password);
  await navBar.isLoggedIn(testController, admin.username);
  await navBar.gotoEditPage(testController);
  await navBar.gotoEditor(testController);
  await editPage.isDisplayed(testController);
  await editPage.edit(
    testController,
    sR.name,
    sR.course,
    sR.semester,
    sR.department,
    sR.email,
    sR.image,
    sR.facts,
    sR.campus_eats,
    sR.hidden_talent,
  );
  /*
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
  */
});

test.skip('Test that devtest page works for admins', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, admin.username, admin.password);
  await navBar.isLoggedIn(testController, admin.username);
  await navBar.gotoDevTest(testController);
  await devTestPage.isDisplayed(testController);
  await devTestPage.devTestAdd(testController);
  await navBar.gotoMyCardsPage(testController);
  await myCardsPage.isDisplayed(testController);
  await myCardsPage.hasAdded(testController);
  /*
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
  */
});
