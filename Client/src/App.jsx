import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; // Le Vigile
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
// Page temporaire pour tester la route Room
const VideoRoom = () => <h1>Salle Vidéo (En construction) </h1>;

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Route Publique */}
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    {/* Tout ce qui est à l'intérieur de ce Route nécessite d'être connecté */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/room/:roomId" element={<VideoRoom />} />
                    </Route>

                    {/* Redirection par défaut */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;