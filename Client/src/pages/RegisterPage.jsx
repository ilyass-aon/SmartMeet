import { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    // On regroupe les inputs dans un seul objet pour simplifier
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    // Gestion générique des champs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Appel au Backend Java
            await api.post('/auth/register', formData);
            
            // Si succès, on redirige vers le login avec une petite alerte
            alert("Compte créé avec succès ! Connectez-vous.");
            navigate('/'); 

        } catch (err) {
            console.error("Erreur inscription:", err);
            // On affiche le message du backend  
            setError(err.response?.data?.message || "Une erreur est survenue lors de l'inscription.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.iconBox}>🔐</div>
                    <h2 style={styles.title}>Inscription</h2>
                    <p style={styles.subtitle}>Rejoignez SmartMeet aujourd'hui</p>
                </div>

                <form onSubmit={handleRegister} style={styles.form}>
                    
                    {/* Champ Pseudo */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Pseudo</label>
                        <input 
                            type="text" 
                            name="username"
                            placeholder="Votre pseudo" 
                            value={formData.username} 
                            onChange={handleChange} 
                            style={styles.input}
                            required 
                        />
                    </div>

                    {/* Champ Email */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input 
                            type="email" 
                            name="email"
                            placeholder="exemple@smartmeet.com" 
                            value={formData.email} 
                            onChange={handleChange} 
                            style={styles.input}
                            required 
                        />
                    </div>
                    
                    {/* Champ Mot de passe */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Mot de passe</label>
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Minimum 6 caractères" 
                            value={formData.password} 
                            onChange={handleChange} 
                            style={styles.input}
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        style={{...styles.button, opacity: isLoading ? 0.7 : 1}}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Création...' : "S'inscrire"}
                    </button>
                </form>

                {error && <div style={styles.errorBox}>{error}</div>}

                <div style={styles.footer}>
                    <p>Déjà un compte ? <Link to="/" style={styles.link}>Se connecter</Link></p>
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
    header: { textAlign: 'center', marginBottom: '20px' },
    iconBox: { fontSize: '40px', marginBottom: '10px' },
    title: { fontSize: '24px', color: '#333', margin: '0 0 5px 0', fontWeight: 'bold' },
    subtitle: { color: '#666', fontSize: '14px', margin: 0 },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '13px', fontWeight: '600', color: '#555', marginLeft: '2px' },
    input: {
        padding: '12px 15px', borderRadius: '8px', border: '1px solid #ddd',
        fontSize: '15px', outline: 'none', backgroundColor: '#f9f9f9'
    },
    button: {
        padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#28a745', // Vert pour l'inscription
        color: '#ffffff', fontSize: '16px', fontWeight: '600', cursor: 'pointer',
        marginTop: '10px', boxShadow: '0 4px 6px rgba(40,167,69,0.3)',
    },
    errorBox: {
        marginTop: '15px', padding: '10px', backgroundColor: '#ffebee',
        color: '#c62828', borderRadius: '6px', fontSize: '14px', textAlign: 'center', border: '1px solid #ffcdd2'
    },
    footer: { marginTop: '25px', textAlign: 'center', fontSize: '14px', color: '#666' },
    link: { color: '#007bff', textDecoration: 'none', fontWeight: '600' }
};

export default RegisterPage;