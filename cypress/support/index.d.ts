declare namespace Cypress {
  interface Chainable {
    addIngredient(ingredientName: string): Chainable<void>;
    openIngredientModal(ingredientName: string): Chainable<void>;
    closeModal(): Chainable<void>;
    mockLogin(): Chainable<void>;
    addIngredients(ingredients: string[]): Chainable<void>;
    shouldContainInConstructor(ingredientName: string): Chainable<void>;
  }
}
