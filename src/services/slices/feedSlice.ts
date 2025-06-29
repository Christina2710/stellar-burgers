import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '../../utils/burger-api';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

export const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const getFeed = createAsyncThunk('feed/getFeed', async () => {
  const response = await getFeedsApi();
  return response;
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearFeed: (state) => {
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
      state.error = null;
      state.loading = false;
    }
  },
  // блок, где обрабатываются результаты асинхронных операций, таких как createAsyncThunk
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.loading = false;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.error =
          action.error.message || 'Ошибка при загрузке ленты заказов';
        state.loading = false;
        state.orders = [];
        state.total = 0;
        state.totalToday = 0;
      });
  }
});
