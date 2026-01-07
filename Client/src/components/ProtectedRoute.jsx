import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    // redirection vers Login Si pas connecté 
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Sinon, on affiche la route demandée (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;