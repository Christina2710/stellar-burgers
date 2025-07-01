export const SELECTORS = {
  modal: '[data-cy="modal"]',
  modalClose: '[data-cy="modal-close"]',
  modalOverlay: '[data-cy="modal-overlay"]',
  burgerConstructor: '[data-cy="burger-constructor"]'
};

Cypress.Commands.add('addIngredient', (ingredientName) => {
  cy.contains(ingredientName).parent().as('ingredientCard'); // сохраняем элемент в alias

  cy.get('@ingredientCard').contains('Добавить').click();
});

Cypress.Commands.add('addIngredients', (ingredients) => {
  ingredients.forEach((ingredient) => {
    cy.addIngredient(ingredient);
  });
});

Cypress.Commands.add('openIngredientModal', (ingredientName) => {
  cy.contains(ingredientName).as('ingredient').click();

  cy.get(SELECTORS.modal).should('exist');
});

Cypress.Commands.add('closeModal', () => {
  cy.get(SELECTORS.modalClose).click();
  cy.get(SELECTORS.modal).should('not.exist');
});

Cypress.Commands.add('mockLogin', () => {
  window.localStorage.setItem('refreshToken', 'mockTestRefreshToken');
  cy.setCookie('accessToken', 'mockTestAccessToken');
});

Cypress.Commands.add('shouldContainInConstructor', (ingredientName) => {
  cy.get(SELECTORS.burgerConstructor).should('contain', ingredientName);
});
