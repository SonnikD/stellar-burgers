import { feedSelector, profileOrderThunk } from '@slices';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const feedState = useSelector(feedSelector);
  const orders: TOrder[] = feedState.orders;
  const dispatch = useDispatch();
  const isLoading = feedState.isLoading;

  useEffect(() => {
    dispatch(profileOrderThunk());
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
