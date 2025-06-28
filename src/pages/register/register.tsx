import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from '../../services/store';
import {
  loginFailed,
  setUser,
  startLogin,
  stopLoading
} from '../../services/slices/userSlice';
import { setCookie } from '../../utils/cookie';
import { registerUserApi } from '@api';
import { RegisterUI } from '@ui-pages';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector((state) => state.user.loading);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');
    dispatch(startLogin());

    registerUserApi({ name: userName, email, password })
      .then((data) => {
        localStorage.setItem('refreshToken', data.refreshToken);
        setCookie('accessToken', data.accessToken);
        dispatch(setUser(data.user));
        navigate('/', { replace: true });
        dispatch(stopLoading());
      })
      .catch((err) => {
        const message = err.message || 'Ошибка регистрации';
        setError(message);
        dispatch(loginFailed(message));
      });
  };

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
