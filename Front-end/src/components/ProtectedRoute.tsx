// src/components/ProtectedRoute.tsx
import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactElement; // Αναμένει ένα ReactElement ως child
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children; // Επιστρέφει το child χωρίς πρόσθετο wrapper
};

export default ProtectedRoute;
