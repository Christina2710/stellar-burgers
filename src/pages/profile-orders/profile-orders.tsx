import { FC, useEffect, useState } from 'react';

import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';

export const ProfileOrders: FC = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrdersApi()
      .then((data) => setOrders(data))
      .catch((err) => {
        setError('Не удалось загрузить заказы');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
