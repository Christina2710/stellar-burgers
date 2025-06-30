beforeEach(() => {
  // Моки
  cy.intercept('GET', '**/api/ingredients', {
    fixture: 'ingredients.json',
    delay: 100 // чтобы увидеть загрузку
  }).as('getIngredients');
  cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
    'getUser'
  );
  cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
    'sendOrder'
  );

  // Мок авторизации
  window.localStorage.setItem('refreshToken', 'mockTestRefreshToken');
  cy.setCookie('accessToken', 'mockTestAccessToken');

  // Загрузка приложения
  cy.visit('http://localhost:4000');
  // дополнительно проверим, что хотя бы один элемент отобразился
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
    // Клик по кнопке "Добавить" у булки
    cy.contains('Флюоресцентная булка R2-D3')
      .parent() // поднимаемся до карточки
      .contains('Добавить')
      .click();

    // Клик по кнопке "Добавить" у начинки
    cy.contains('Филе Люминесцентного тетраодонтимформа')
      .parent()
      .contains('Добавить')
      .click();

    // Клик по кнопке "Добавить" у соуса
    cy.contains('Соус фирменный Space Sauce')
      .parent()
      .contains('Добавить')
      .click();

    // Проверка, что все ингредиенты в конструкторе
    cy.get('[data-cy="burger-constructor"]')
      .should('contain', 'Флюоресцентная булка R2-D3')
      .and('contain', 'Филе Люминесцентного тетраодонтимформа')
      .and('contain', 'Соус фирменный Space Sauce');
  });
});
describe('Модальное окно ингредиента', () => {
  it('должно открываться при клике на ингредиент', () => {
    cy.contains('Флюоресцентная булка R2-D3').click();
    cy.get('[data-cy="modal"]').should('exist');
    cy.contains('Детали ингредиента').should('exist');
    cy.contains('Флюоресцентная булка R2-D3').should('exist');
  });

  it('должно закрываться при клике на крестик', () => {
    cy.contains('Флюоресцентная булка R2-D3').click();
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('должно закрываться при клике на оверлей', () => {
    cy.contains('Флюоресцентная булка R2-D3').click();
    cy.get('[data-cy="modal-overlay"]').click('topLeft', { force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });
});
describe('Создание заказа', () => {
  it('собирает бургер и создаёт заказ', () => {
    // Добавляем булку
    cy.contains('Флюоресцентная булка R2-D3')
      .parent()
      .contains('Добавить')
      .click();

    cy.contains('Оформить заказ').should('be.visible');

    // Добавляем начинку
    cy.contains('Филе Люминесцентного тетраодонтимформа')
      .parent()
      .contains('Добавить')
      .click();

    // Добавляем соус
    cy.contains('Соус фирменный Space Sauce')
      .parent()
      .contains('Добавить')
      .click();

    // Кликаем по кнопке "Оформить заказ"

    cy.contains('Оформить заказ').click();

    // Ждём, пока отправится запрос
    cy.wait('@sendOrder');

    // Проверка, что открылось модальное окно с номером заказа
    cy.contains('10').should('exist');

    // Закрываем модальное окно
    cy.get('[data-cy="modal-close"]').click();

    // Проверяем, что конструктор пустой
    cy.get('[data-cy="burger-constructor"]')
      .should('contain', 'Выберите булки')
      .and('contain', 'Выберите начинку');
  });
  it('должен редиректить на логин при попытке оформить заказ неавторизованным пользователем', () => {
    // Удаляем токены авторизации
    cy.clearLocalStorage('refreshToken');
    cy.clearCookie('accessToken');

    // Перехватываем запрос к /auth/user, чтобы вернуть ошибку авторизации
    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 401,
      body: {
        success: false,
        message: 'You should be authorised'
      }
    }).as('getUnauthUser');

    // Загружаем приложение
    cy.visit('http://localhost:4000');

    cy.wait('@getIngredients');
    cy.wait('@getUnauthUser');

    // Добавляем ингредиенты в бургер
    cy.contains('Флюоресцентная булка R2-D3')
      .parent()
      .contains('Добавить')
      .click();
    cy.contains('Филе Люминесцентного тетраодонтимформа')
      .parent()
      .contains('Добавить')
      .click();

    // Кликаем "Оформить заказ"
    cy.contains('Оформить заказ').click();

    // Проверяем, что произошёл редирект на /login
    cy.url().should('include', '/login');

    // Проверяем наличие формы логина
    cy.contains('Вход').should('exist');
  });
});
