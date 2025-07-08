import {
  ingredientsSlice,
  getIngredients,
  initialState
} from '../ingredientsSlice';

const { reducer, actions } = ingredientsSlice;

const mockIngredient = {
  _id: '1',
  name: 'Булка',
  type: 'bun',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 100,
  image: '',
  image_mobile: '',
  image_large: '',
  __v: 0
};

describe('ingredientsSlice', () => {
  test('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('Синхронные экшены', () => {
    test('clearIngredients должен очищать список ингредиентов', () => {
      const filledState = { ...initialState, ingredients: [mockIngredient] };
      const nextState = reducer(filledState, actions.clearIngredients());

      expect(nextState.ingredients).toEqual([]);
    });

    test('addIngredient должен добавлять ингредиент в список', () => {
      const nextState = reducer(
        initialState,
        actions.addIngredient(mockIngredient)
      );

      expect(nextState.ingredients).toEqual([mockIngredient]);
    });
  });

  describe('Асинхронный экшен getIngredients', () => {
    test('при pending должен устанавливать loading=true и error=null', () => {
      const action = { type: getIngredients.pending.type };
      const nextState = reducer(initialState, action);

      expect(nextState.loading).toBe(true);
      expect(nextState.error).toBeNull();
    });

    test('при fulfilled должен сохранять ингредиенты и выключать loading', () => {
      const action = {
        type: getIngredients.fulfilled.type,
        payload: [mockIngredient]
      };
      const nextState = reducer(initialState, action);

      expect(nextState.ingredients).toEqual([mockIngredient]);
      expect(nextState.loading).toBe(false);
    });

    test('при rejected с ошибкой должен сохранять сообщение об ошибке', () => {
      const action = {
        type: getIngredients.rejected.type,
        error: { message: 'Ошибка загрузки' }
      };
      const nextState = reducer(initialState, action);

      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe('Ошибка загрузки');
    });

    test('при rejected без сообщения должен устанавливать ошибку по умолчанию', () => {
      const action = {
        type: getIngredients.rejected.type,
        error: {}
      };
      const nextState = reducer(initialState, action);

      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe('Ошибка при загрузке ингредиентов');
    });
  });
});
