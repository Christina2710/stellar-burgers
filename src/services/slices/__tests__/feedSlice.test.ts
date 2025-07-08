import { feedSlice, getFeed, initialState } from '../feedSlice';
import { TOrdersData } from '@utils-types';

const { reducer } = feedSlice;

const mockData: TOrdersData = {
  orders: [
    {
      _id: 'abc123',
      name: 'Заказ 1',
      status: 'done',
      ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941'],
      createdAt: '2025-06-29T10:00:00.000Z',
      updatedAt: '2025-06-29T10:05:00.000Z',
      number: 1
    }
  ],
  total: 500,
  totalToday: 50
};
describe('feedSlice', () => {
  test('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });
  describe('синхронные экшены', () => {
    test('clearFeed сбрасывает состояние в начальное', () => {
      const modifiedState = {
        orders: [
          {
            _id: '1',
            ingredients: [],
            status: 'done',
            number: 123,
            createdAt: '',
            updatedAt: '',
            name: 'Test'
          }
        ],
        total: 100,
        totalToday: 10,
        loading: true,
        error: 'Some error'
      };

      const newState = reducer(modifiedState, feedSlice.actions.clearFeed());

      expect(newState).toEqual(initialState);
    });
  });

  describe('асинхронный экшен getFeed', () => {
    test('getFeed.pending устанавливает loading = true и error = null', () => {
      const state = reducer(initialState, getFeed.pending('', undefined));
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('getFeed.fulfilled обновляет стейт с новыми данными', () => {
      const action = {
        type: getFeed.fulfilled.type,
        payload: mockData
      };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockData.orders);
      expect(state.total).toBe(500);
      expect(state.totalToday).toBe(50);
      expect(state.error).toBeNull();
    });

    test('getFeed.rejected записывает ошибку и очищает данные', () => {
      const action = {
        type: getFeed.rejected.type,
        error: { message: 'Ошибка получения данных' }
      };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка получения данных');
      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });
    test('getFeed.rejected без message использует сообщение по умолчанию', () => {
      const action = {
        type: getFeed.rejected.type,
        error: {}
      };
      const state = reducer(initialState, action);

      expect(state.error).toBe('Ошибка при загрузке ленты заказов');
    });
  });
});
