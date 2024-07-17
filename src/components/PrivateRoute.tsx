// src/components/PrivateRoute.tsx

import React from 'react';
import { Route, Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  path: string;
  component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const authToken = localStorage.getItem('authToken');

  return (
    <Route
      {...rest}
      element={authToken ? <Component /> : <Navigate to="/login" />}
    />
  );
};

export default PrivateRoute;
