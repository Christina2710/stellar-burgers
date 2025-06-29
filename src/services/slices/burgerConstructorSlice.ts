import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '../../utils/types';

type TBurgerConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        state.ingredients.push(action.payload);
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    // перетаскивание ингредиентов внутри конструктора бургера
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const updated = [...state.ingredients]; // Копируем массив
      const [moved] = updated.splice(fromIndex, 1); // Удаляем элемент
      updated.splice(toIndex, 0, moved); // Вставляем на новое место
      state.ingredients = updated; // Обновляем состояние
    },

    clearBurgerConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearBurgerConstructor
} = burgerConstructorSlice.actions;
