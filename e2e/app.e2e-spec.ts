import { AngularOfflineStorePage } from './app.po';

describe('angular-offline-store App', () => {
  let page: AngularOfflineStorePage;

  beforeEach(() => {
    page = new AngularOfflineStorePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
