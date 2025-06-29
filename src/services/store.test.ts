import store from './store';

import { RootState } from './store';

describe('Redux store', () => {
  test('должен инициализироваться с корректными начальными значениями', () => {
    const initialState: RootState = store.getState();

    expect(initialState.ingredients).toBeDefined();
    expect(initialState.user).toBeDefined();
    expect(initialState.feed).toBeDefined();
    expect(initialState.order).toBeDefined();
    expect(initialState.burgerConstructor).toBeDefined();

    expect(initialState.ingredients).toEqual({
      ingredients: [],
      loading: false,
      error: null
    });

    expect(initialState.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });

    expect(initialState.order).toEqual({
      order: null,
      orderRequest: false,
      orderModalData: null,
      error: null
    });

    expect(initialState.user).toEqual({
      user: null,
      loading: false,
      isAuthenticated: false,
      isAuthChecked: false,
      error: null,
      loginUserError: null,
      loginUserRequest: false
    });

    expect(initialState.feed).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      loading: false,
      error: null
    });
  });

  test('store dispatch работает корректно', () => {
    const action = { type: 'ingredients/clearIngredients' };
    store.dispatch(action);

    const state = store.getState();
    expect(state.ingredients.ingredients).toEqual([]);
  });
});
