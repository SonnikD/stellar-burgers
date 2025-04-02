import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { userSelector } from '@slices';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const userState = useSelector(userSelector);
  const name = userState.user?.name;

  return <AppHeaderUI userName={name} />;
};
