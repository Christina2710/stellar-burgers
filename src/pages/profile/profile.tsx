import { FC, SyntheticEvent, useEffect, useState } from 'react';

import { useSelector, useDispatch } from '../../services/store';
import { setUser } from '../../services/slices/userSlice';
import { updateUserApi } from '@api';

import { ProfileUI } from '@ui-pages';

export const Profile: FC = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [error, setError] = useState('');

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    updateUserApi(formValue)
      .then((data) => {
        dispatch(setUser(data.user));
      })
      .catch((err) => {
        const message = err.message || 'Ошибка обновления профиля';
        setError(message);
      });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <ProfileUI
        formValue={formValue}
        isFormChanged={isFormChanged}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
      />
    </>
  );
};
