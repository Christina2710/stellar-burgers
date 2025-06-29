import {
  userSlice,
  setUser,
  logout,
  setAuthChecked,
  startLogin,
  loginFailed,
  clearError,
  startLoading,
  stopLoading,
  initialState,
  getUser
} from '../userSlice';
import { TUser } from '../../../utils/types';

const { reducer } = userSlice;

const mockUser: TUser = {
  name: 'Тест Пользователь',
  email: 'test@example.com'
};

describe('userSlice', () => {
  test('должен вернуть начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('setUser должен установить пользователя и авторизовать его', () => {
    const state = reducer(initialState, setUser(mockUser));
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.loginUserRequest).toBe(false);
    expect(state.loginUserError).toBeNull();
  });

  test('logout должен сбросить пользователя и авторизацию', () => {
    const loggedInState = {
      ...initialState,
      user: mockUser,
      isAuthenticated: true
    };
    const state = reducer(loggedInState, logout());
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  test('setAuthChecked должен установить isAuthChecked', () => {
    const state = reducer(initialState, setAuthChecked(true));
    expect(state.isAuthChecked).toBe(true);
  });

  test('startLogin должен установить флаги loginUserRequest и очистить ошибки', () => {
    const state = reducer(
      { ...initialState, loginUserError: 'ошибка' },
      startLogin()
    );
    expect(state.loginUserRequest).toBe(true);
    expect(state.loginUserError).toBeNull();
    expect(state.loading).toBe(true);
  });

  test('loginFailed должен установить loginUserError и сбросить loading', () => {
    const state = reducer(
      { ...initialState, loginUserRequest: true, loading: true },
      loginFailed('Неверный пароль')
    );
    expect(state.loginUserError).toBe('Неверный пароль');
    expect(state.loginUserRequest).toBe(false);
    expect(state.loading).toBe(false);
  });

  test('clearError должен сбрасывать error и loginUserError', () => {
    const stateWithErrors = {
      ...initialState,
      error: 'Ошибка',
      loginUserError: 'Логин ошибка'
    };
    const state = reducer(stateWithErrors, clearError());
    expect(state.error).toBeNull();
    expect(state.loginUserError).toBeNull();
  });

  test('startLoading / stopLoading должны переключать флаг загрузки', () => {
    let state = reducer(initialState, startLoading());
    expect(state.loading).toBe(true);

    state = reducer(state, stopLoading());
    expect(state.loading).toBe(false);
  });
});
describe('асинхронный экшен getUser', () => {
  test('getUser.pending сбрасывает ошибку', () => {
    const state = reducer(
      { ...initialState, error: 'старое сообщение' },
      { type: getUser.pending.type }
    );
    expect(state.error).toBeNull();
  });

  test('getUser.fulfilled устанавливает пользователя и флаги', () => {
    const state = reducer(initialState, {
      type: getUser.fulfilled.type,
      payload: mockUser
    });

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
  });

  test('getUser.rejected сбрасывает пользователя и устанавливает ошибку', () => {
    const errorMessage = 'Ошибка запроса';
    const state = reducer(initialState, {
      type: getUser.rejected.type,
      error: { message: errorMessage }
    });

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBe(errorMessage);
  });
});
