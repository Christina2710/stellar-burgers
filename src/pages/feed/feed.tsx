import { FC, useEffect } from 'react';

import { useSelector, useDispatch } from '../../services/store';
import { getFeed } from '../../services/slices/feedSlice';

import { TOrder } from '@utils-types';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  // загрузка при монтировании компонента
  useEffect(() => {
    dispatch(getFeed());
  }, [dispatch]);

  const loading = useSelector((state) => state.feed.loading);

  // функция обновления
  const handleGetFeeds = () => {
    dispatch(getFeed());
  };

  const orders: TOrder[] = useSelector((state) => state.feed.orders);

  if (!orders.length || loading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
