import {
  initialState,
  burgerConstructorSlice,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearBurgerConstructor
} from '../burgerConstructorSlice';
import { TConstructorIngredient } from '../../../utils/types';

const { reducer } = burgerConstructorSlice;

const bun: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  id: 'bun-krator-n200i',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
};

const ingredient1: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  id: 'sauce-spicy-x',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png'
};

const ingredient2: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093e',
  id: 'main-file-lumi',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png'
};

describe('burgerConstructorSlice', () => {
  test('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('addIngredient: должен установить булку, если тип "bun"', () => {
    const state = reducer(undefined, addIngredient(bun));
    expect(state.bun).toEqual(bun);
    expect(state.ingredients).toEqual([]);
  });

  test('addIngredient: должен добавить ингредиент в список, если тип не "bun"', () => {
    const state = reducer(undefined, addIngredient(ingredient1));
    expect(state.ingredients).toEqual([ingredient1]);
  });
  test('addIngredient: должен заменять булку, если тип "bun" уже установлен', () => {
    const initialState = reducer(undefined, addIngredient(bun));
    const newBun = {
      ...bun,
      id: 'new-bun-id',
      _id: 'bun2',
      name: 'Новая булка'
    };
    const state = reducer(initialState, addIngredient(newBun));
    expect(state.bun).toEqual(newBun);
  });

  test('removeIngredient: должен удалить ингредиент по id', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [ingredient1, ingredient2]
    };
    const state = reducer(
      stateWithIngredients,
      removeIngredient(ingredient1.id)
    );
    expect(state.ingredients).toEqual([ingredient2]);
  });
  test('removeIngredient: не должен менять состояние, если id не найден', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [ingredient1]
    };
    const state = reducer(
      stateWithIngredients,
      removeIngredient('несуществующий-id')
    );
    expect(state.ingredients).toEqual([ingredient1]);
  });

  test('moveIngredient: должен переместить ингредиент внутри массива', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [ingredient1, ingredient2]
    };
    const action = moveIngredient({ fromIndex: 0, toIndex: 1 });
    const state = reducer(stateWithIngredients, action);
    expect(state.ingredients).toEqual([ingredient2, ingredient1]);
  });
  test('moveIngredient: не должен менять порядок, если fromIndex === toIndex', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [ingredient1, ingredient2]
    };
    const state = reducer(
      stateWithIngredients,
      moveIngredient({ fromIndex: 0, toIndex: 0 })
    );
    expect(state.ingredients).toEqual([ingredient1, ingredient2]);
  });

  test('clearBurgerConstructor: должен очищать bun и ingredients', () => {
    const filledState = {
      bun,
      ingredients: [ingredient1, ingredient2]
    };
    const state = reducer(filledState, clearBurgerConstructor());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });
});
