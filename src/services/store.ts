import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import {
  ingredientsSlice,
  userSlice,
  feedSlice,
  burgerConstructorSlice,
  orderSlice
} from './slices';

// Объединение всех редьюсеров
const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  user: userSlice.reducer,
  feed: feedSlice.reducer,
  order: orderSlice.reducer,
  burgerConstructor: burgerConstructorSlice.reducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
