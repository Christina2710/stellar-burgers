import { Navigate, useLocation } from 'react-router';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean; // если true — это страница только для НЕавторизованных
  children: React.ReactElement; // то, что мы защищаем (компонент страницы), например, <Login />, <Profile /> и т.д
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = true; // (в будущем будет получаться из Redux) — "проверили ли мы, авторизован ли пользователь"
  const user = true; // (в будущем будет получаться из Redux) — сам пользователь (если null или false — не авторизован)
  const location = useLocation(); // текущий URL, с которого зашли

  // пока идёт проверка авторизации
  if (!isAuthChecked) {
    // если мы ещё не знаем, авторизован человек или нет — просто показываем загрузку
    return <Preloader />;
  }

  // попытка зайти на защищённую страницу без авторизации
  if (!onlyUnAuth && !user) {
    // если пользователь на странице авторизации и данных в хранилище нет, то делаем редирект
    return <Navigate replace to='/login' state={{ from: location }} />; // в поле from объекта location.state записываем информацию о URL
  }

  // Попытка авторизованного попасть на "гостевую" страницу
  if (onlyUnAuth && user) {
    // Если это гостевая страница (логин, регистрация), а пользователь уже вошёл,
    // перенаправляем его обратно туда, откуда он пришёл, или на главную (/), если неизвестно
    const from = location.state?.from || { pathname: '/' };

    return <Navigate replace to={from} />;
  }

  // показать вложенные компоненты, которые обёрнуты в <ProtectedRoute> — если все условия доступа выполнены
  return children;
};
