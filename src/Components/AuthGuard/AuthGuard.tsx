import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
//@ts-ignore
import Cookies from 'js-cookie';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      setIsAuthenticated(true);
      
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    // Пока идет проверка, можно показать загрузочный экран или что-то подобное
    return <div>Loading...</div>;
  }

  // Если пользователь аутентифицирован, отображаем дочерние компоненты
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Если пользователь не аутентифицирован, перенаправляем на страницу логина
  return <Navigate to="/sign-in" />;
};

export default AuthGuard;
