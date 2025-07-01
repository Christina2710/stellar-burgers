import { SELECTORS } from '../support/commands';

beforeEach(() => {
  cy.intercept('GET', '**/api/ingredients', {
    fixture: 'ingredients.json',
    delay: 100
  }).as('getIngredients');
  cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
    'getUser'
  );
  cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
    'sendOrder'
  );

  cy.mockLogin();

  cy.visit('/');
  cy.contains('Конструктор').should('exist');
  cy.wait('@getIngredients');
  cy.wait('@getUser');
});

afterEach(() => {
  cy.clearLocalStorage();
  cy.clearCookies();
});

describe('Конструктор бургера — ингредиенты', () => {
  it('должен отобразить список ингредиентов из мока', () => {
    cy.contains('Флюоресцентная булка R2-D3').should('exist');
    cy.contains('Филе Люминесцентного тетраодонтимформа').should('exist');
    cy.contains('Соус фирменный Space Sauce').should('exist');
  });
});

describe('Добавление ингредиентов в конструктор', () => {
  it('должен добавить булку и начинку в конструктор через кнопку', () => {
    cy.addIngredients([
      'Флюоресцентная булка R2-D3',
      'Филе Люминесцентного тетраодонтимформа',
      'Соус фирменный Space Sauce'
    ]);

    cy.shouldContainInConstructor('Флюоресцентная булка R2-D3');
    cy.shouldContainInConstructor('Филе Люминесцентного тетраодонтимформа');
    cy.shouldContainInConstructor('Соус фирменный Space Sauce');
  });
});

describe('Модальное окно ингредиента', () => {
  it('должно открываться при клике на ингредиент', () => {
    cy.openIngredientModal('Флюоресцентная булка R2-D3');
    cy.contains('Детали ингредиента').should('exist');
    cy.contains('Флюоресцентная булка R2-D3').should('exist');
  });

  it('должно закрываться при клике на крестик', () => {
    cy.openIngredientModal('Флюоресцентная булка R2-D3');
    cy.closeModal();
  });

  it('должно закрываться при клике на оверлей', () => {
    cy.openIngredientModal('Флюоресцентная булка R2-D3');
    cy.get(SELECTORS.modalOverlay).click('topLeft', { force: true });
    cy.get(SELECTORS.modal).should('not.exist');
  });
});

describe('Создание заказа', () => {
  it('собирает бургер и создаёт заказ', () => {
    cy.addIngredients([
      'Флюоресцентная булка R2-D3',
      'Филе Люминесцентного тетраодонтимформа',
      'Соус фирменный Space Sauce'
    ]);

    cy.contains('Оформить заказ').click();
    cy.wait('@sendOrder');
    cy.contains('10').should('exist');
    cy.closeModal();

    cy.get(SELECTORS.burgerConstructor)
      .should('contain', 'Выберите булки')
      .and('contain', 'Выберите начинку');
  });

  it('должен редиректить на логин при попытке оформить заказ неавторизованным пользователем', () => {
    cy.clearLocalStorage('refreshToken');
    cy.clearCookie('accessToken');

    cy.visit('/');
    cy.wait('@getIngredients');

    cy.addIngredients([
      'Флюоресцентная булка R2-D3',
      'Филе Люминесцентного тетраодонтимформа'
    ]);

    cy.contains('Оформить заказ').click();
    cy.url().should('include', '/login');
    cy.contains('Вход').should('exist');
  });
});
