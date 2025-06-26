import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loginUserApi } from '@api';
import { LoginUI } from '@ui-pages';

import { setCookie } from '../../utils/cookie';
import { useDispatch } from '../../services/store';
import {
  loginFailed,
  setUser,
  startLogin
} from '../../services/slices/userSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');
    dispatch(startLogin());

    loginUserApi({ email, password })
      .then((data) => {
        localStorage.setItem('refreshToken', data.refreshToken);
        setCookie('accessToken', data.accessToken);
        dispatch(setUser(data.user));
        navigate('/', { replace: true });
      })
      .catch((err) => {
        const message = err.message || 'Ошибка входа';
        setError(message);
        dispatch(loginFailed(message));
      });
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
