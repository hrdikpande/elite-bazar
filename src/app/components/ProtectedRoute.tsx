import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';

interface ProtectedRouteProps {
    allowedRoles?: ('admin' | 'distributor' | 'customer')[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { user } = useStore();
    const location = useLocation();

    if (!user) {
        // Smart Redirect based on attempted path
        if (location.pathname.startsWith('/admin')) {
            return <Navigate to="/admin/login" state={{ from: location }} replace />;
        }
        if (location.pathname.startsWith('/distributor')) {
            return <Navigate to="/distributor/login" state={{ from: location }} replace />;
        }
        // Default to user login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to unauthorized or home if role doesn't match
        // For now, redirect to relevant dashboard or home
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        if (user.role === 'distributor') return <Navigate to="/distributor" replace />;
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
