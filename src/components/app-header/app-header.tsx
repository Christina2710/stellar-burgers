import { FC } from 'react';
import { useSelector } from '../../services/store';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const userName = useSelector((state) => state.user.user?.name || '');
  return <AppHeaderUI userName={userName} />;
};
