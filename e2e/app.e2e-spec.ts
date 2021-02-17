import { AngulartestPage } from './app.po';
import {element, by} from 'protractor';

describe('angulartest App', () => {
  let page: AngulartestPage;

  beforeEach(() => {
    page = new AngulartestPage();
  });

  it('should check that the login page with user, password and submit button exists', () => {
    page.navigateTo();
    const usuario = element(by.id('md-input-1'));
    const clave = element(by.id('md-input-3'));
    const submitButton = element(by.className('loginBtn'));

    expect(usuario.isPresent()).toBe(true);
    expect(clave.isPresent()).toBe(true);
    expect(submitButton.isPresent()).toBe(true);
  });
});
