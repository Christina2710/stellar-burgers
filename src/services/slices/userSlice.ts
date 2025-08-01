import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { TUser } from '../../utils/types';
import { getUserApi } from '../../utils/burger-api';

interface TUserState {
  user: TUser | null; // xранит информацию о текущем пользователе
  loading: boolean; // флаг загрузки при общих действиях с пользователем
  isAuthenticated: boolean; //показывает, авторизован ли пользователь
  isAuthChecked: boolean; // показывает, завершилась ли проверка токена
  error: string | null; // ошибка, связанная с загрузкой данных пользователя
  loginUserError: string | null; // специальная ошибка для входа
  loginUserRequest: boolean; // флаг отправки запроса на вход
}

export const initialState: TUserState = {
  user: null,
  loading: false,
  isAuthenticated: false,
  isAuthChecked: false,
  error: null,
  loginUserError: null,
  loginUserRequest: false
};

// getUser — для проверки и получения данных текущего пользователя
export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loginUserRequest = false;
      state.loginUserError = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    startLogin: (state) => {
      state.loginUserRequest = true;
      state.loginUserError = null;
      state.loading = true;
    },
    loginFailed: (state, action: PayloadAction<string>) => {
      state.loginUserRequest = false;
      state.loginUserError = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
      state.loginUserError = null;
    },
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.error =
          action.error.message || 'Ошибка при загрузке данных пользователя';
      });
  }
});

export const {
  setUser,
  logout,
  setAuthChecked,
  clearError,
  startLogin,
  loginFailed,
  startLoading,
  stopLoading
} = userSlice.actions;

export default userSlice.reducer;
