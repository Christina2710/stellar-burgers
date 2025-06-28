import { FC, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from '../../services/store';
import { clearOrderModal, sendOrder } from '../../services/slices/orderSlice';
import { clearBurgerConstructor } from '../../services/slices/burgerConstructorSlice';

import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector((state) => state.burgerConstructor);

  const orderRequest = useSelector((state) => state.order.orderRequest);

  const orderModalData = useSelector((state) => state.order.orderModalData);

  const user = useSelector((state) => state.user.user);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (orderRequest || !constructorItems.bun) return;

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];

    dispatch(sendOrder(ingredientsIds));
  };

  // очищает конструктор бургера, как только заказ оформлен
  useEffect(() => {
    if (orderModalData) {
      dispatch(clearBurgerConstructor());
    }
  }, [orderModalData, dispatch]);

  const closeOrderModal = () => {
    dispatch(clearOrderModal());
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
