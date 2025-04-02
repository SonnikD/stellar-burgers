import { feedThunk, feedSelector } from '@slices';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const feedState = useSelector(feedSelector);
  const orders: TOrder[] = feedState.orders;
  const dispatch = useDispatch();
  const isLoading = feedState.isLoading;

  const handleGetFeeds = () => {
    dispatch(feedThunk());
  };

  useEffect(() => {
    handleGetFeeds();
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
