// src/routes/BuyerRoute.tsx
import { useAuthStore } from '@/store/authStore';
import { Navigate } from 'react-router-dom';

const BuyerRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuthStore();
  return user && user.role === 'buyer' ? children : <Navigate to="/login" replace />;
};

export default BuyerRoute;