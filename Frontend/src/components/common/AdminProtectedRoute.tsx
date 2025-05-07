// src/components/common/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface AdminProtectedRouteProps {
  element: React.ReactElement;
  requiredRole?: string;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ element, requiredRole }) => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  // Get user role from localStorage or context
  const userRole = localStorage.getItem('userRole');
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If role is required but user doesn't have it, redirect to unauthorized page
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // Otherwise, render the protected component
  return element;
};

export default AdminProtectedRoute;