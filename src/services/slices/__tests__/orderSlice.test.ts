import {
  orderSlice,
  initialState,
  sendOrder,
  getOrderByNumber,
  clearOrderModal
} from '../orderSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: 'order123',
  status: 'done',
  name: 'Тестовый заказ',
  number: 1,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  ingredients: ['643d69a5c3f7b9001cfa093c']
};

const { reducer } = orderSlice;

describe('orderSlice', () => {
  test('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('асинхронный экшен sendOrder', () => {
    test('pending: должен установить orderRequest = true и очистить ошибку', () => {
      const action = { type: sendOrder.pending.type };
      const state = reducer(initialState, action);
      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    test('fulfilled: должен установить заказ и модальное окно, orderRequest = false', () => {
      const action = {
        type: sendOrder.fulfilled.type,
        payload: mockOrder
      };
      const state = reducer(initialState, action);
      expect(state.orderRequest).toBe(false);
      expect(state.order).toEqual(mockOrder);
      expect(state.orderModalData).toEqual(mockOrder);
    });

    test('rejected: должен установить ошибку и orderRequest = false', () => {
      const action = {
        type: sendOrder.rejected.type,
        error: { message: 'Ошибка сети' }
      };
      const state = reducer(initialState, action);
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe('Ошибка сети');
    });

    test('rejected: если message отсутствует, должна быть дефолтная ошибка', () => {
      const action = {
        type: sendOrder.rejected.type,
        error: {}
      };
      const state = reducer(initialState, action);
      expect(state.error).toBe('Ошибка при создании заказа');
    });
  });

  describe('асинхронный экшен getOrderByNumber', () => {
    test('pending: должен установить orderRequest = true и очистить ошибку', () => {
      const action = { type: getOrderByNumber.pending.type };
      const state = reducer(initialState, action);
      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    test('fulfilled: должен установить данные в orderModalData', () => {
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const state = reducer(initialState, action);
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
    });

    test('rejected: должен установить ошибку и orderRequest = false', () => {
      const action = {
        type: getOrderByNumber.rejected.type,
        error: { message: 'Ошибка запроса' }
      };
      const state = reducer(initialState, action);
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe('Ошибка запроса');
    });

    test('rejected: если message отсутствует, должна быть дефолтная ошибка', () => {
      const action = {
        type: getOrderByNumber.rejected.type,
        error: {}
      };
      const state = reducer(initialState, action);
      expect(state.error).toBe('Ошибка при загрузке заказа');
    });
  });

  describe('синхронныый экшен', () => {
    test('clearOrderModal: должен очищать orderModalData', () => {
      const stateWithModal = {
        ...initialState,
        orderModalData: mockOrder
      };
      const state = reducer(stateWithModal, clearOrderModal());
      expect(state.orderModalData).toBeNull();
    });
  });
});
