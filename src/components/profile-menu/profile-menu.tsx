import { FC, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ProfileMenuUI } from '@ui';

import { logoutApi } from '@api';
import { deleteCookie } from '../../utils/cookie';

import { useDispatch } from '../../services/store';
import { logout } from '../../services/slices/userSlice';

export const ProfileMenu: FC = () => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    setIsLoading(true);

    logoutApi()
      .then(() => {
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
        dispatch(logout());
        navigate('/login', { replace: true });
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <ProfileMenuUI
        handleLogout={handleLogout}
        pathname={pathname}
        isLoading={isLoading}
      />
    </>
  );
};
