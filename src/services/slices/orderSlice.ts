import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';

type TOrderState = {
  order: TOrder | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

export const initialState: TOrderState = {
  order: null,
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const sendOrder = createAsyncThunk(
  'order/sendOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(sendOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.order = action.payload;
        state.orderModalData = action.payload;
      })
      .addCase(sendOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка при создании заказа';
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderModalData = action.payload;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка при загрузке заказа';
      });
  }
});

export const { clearOrderModal } = orderSlice.actions;
