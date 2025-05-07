// // src/routes/ProtectedRoute.tsx
// import { useAuthStore } from '@/store/authStore';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
//   const { user } = useAuthStore();
//   return user ? children : <Navigate to="/login" replace />;
// };


// export default ProtectedRoute;

// src/routes/ProtectedRoute.tsx
import { useAuthStore } from '@/store/authStore';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuthStore();
  const location = useLocation();

  // If user is not authenticated, redirect to login
  if (!user) {
    return ;
  }

  // If roles are specified, check if user has required role
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role?.toLowerCase() || '';
    const hasPermission = allowedRoles.some(
      role => role.toLowerCase() === userRole
    );

    console.log(
      `Role check: User role: ${userRole}, Allowed roles: ${allowedRoles.join(', ')}, 
      Has permission: ${hasPermission}`
    );

    // If user doesn't have required role, redirect to unauthorized or home
    if (!hasPermission) {
      return ;
    }
  }

  // User is authenticated and has required role (or no specific role required)
  return children;
};

export default ProtectedRoute;
