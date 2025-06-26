import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { registerUserApi } from '@api';
import { RegisterUI } from '@ui-pages';
import { setCookie } from '../../utils/cookie';
import { useDispatch } from '../../services/store';
import {
  loginFailed,
  setUser,
  startLogin
} from '../../services/slices/userSlice';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    />
  );
};
