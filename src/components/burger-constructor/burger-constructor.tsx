import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  clearOrderModalData,
  constructorSelector,
  createOrderThunk,
  toggleOrderRequest,
  userSelector
} from '@slices';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const constructorState = useSelector(constructorSelector);
  const userState = useSelector(userSelector);
  const isAuth = userState.isAuthChecked;
  const constructorItems = constructorState.items;
  const orderRequest = constructorState.orderRequest;
  const orderModalData = constructorState.orderModalData;

  const onOrderClick = () => {
    if (constructorItems.bun && !isAuth) navigate('/login');
    if (constructorItems.bun && isAuth) {
      dispatch(toggleOrderRequest(true));

      const ingredientsListId = constructorItems.ingredients.map(
        (ingredient) => ingredient._id
      );

      const order = [
        constructorItems.bun._id,
        ...ingredientsListId,
        constructorItems.bun._id
      ];

      dispatch(createOrderThunk(order));
    }
  };

  const closeOrderModal = () => {
    dispatch(toggleOrderRequest(false));
    dispatch(clearOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
