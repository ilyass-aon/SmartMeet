import { useState } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); 
    
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            
            const { token, username } = response.data;
            login(token, username);

            navigate('/dashboard');

        } catch (err) {
            console.error("Erreur login:", err);
            setError("Email ou mot de passe incorrect.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.iconBox}>🔐</div>
                    <h2 style={styles.title}>Connexion</h2>
                    <p style={styles.subtitle}>Bienvenue sur SmartMeet</p>
                </div>

                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input 
                            type="email" 
                            placeholder="exemple@smartmeet.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            style={styles.input}
                            required 
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Mot de passe</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            style={styles.input}
                            required 
                        />
                        <span class="fa fa-eye " id="togglePassword"  ></span>
                    </div>

                    <button 
                        type="submit" 
                        style={{...styles.button, opacity: isLoading ? 0.7 : 1}}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                {error && <div style={styles.errorBox}>{error}</div>}

                <div style={styles.footer}>
                    <p>Pas encore de compte ? <Link to="/register" style={styles.link}>Créer un compte</Link></p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 
        fontFamily: "'Segoe UI', sans-serif",
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '15px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px',
    },
    iconBox: {
        fontSize: '40px',
        marginBottom: '10px',
    },
    title: {
        fontSize: '24px',
        color: '#333',
        margin: '0 0 5px 0',
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#666',
        fontSize: '14px',
        margin: 0,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#555',
        marginLeft: '2px',
    },
    input: {
        padding: '12px 15px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '15px',
        outline: 'none',
        transition: 'border-color 0.2s',
        backgroundColor: '#f9f9f9',
    },
    button: {
        padding: '12px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#ffffff',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '10px',
        boxShadow: '0 4px 6px rgba(0,123,255,0.3)',
        transition: 'transform 0.1s',
    },
    errorBox: {
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#ffebee',
        color: '#c62828',
        borderRadius: '6px',
        fontSize: '14px',
        textAlign: 'center',
        border: '1px solid #ffcdd2',
    },
    footer: {
        marginTop: '25px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#666',
    },
    link: {
        color: '#007bff',
        cursor: 'pointer',
        fontWeight: '600',
    }
};

export default LoginPage;