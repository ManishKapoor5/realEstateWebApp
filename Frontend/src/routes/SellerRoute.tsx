// src/routes/SellerRoute.tsx
import { useAuthStore } from '@/store/authStore';
import { Navigate } from 'react-router-dom';

const SellerRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuthStore();
  return user && user.role === 'seller' ? children : <Navigate to="/login" replace />;
};

export default SellerRoute;
