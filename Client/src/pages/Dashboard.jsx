import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const [roomIdInput, setRoomIdInput] = useState('');
    const navigate = useNavigate();

    const username = localStorage.getItem('username') || "Utilisateur";
    const { logout } = useAuth(); 

    const createMeeting = async () => {
        try {
            const response = await api.post('/meetings/create', { title: `Réunion de ${username}` });
            navigate(`/room/${response.data.roomId}`);
        } catch (error) {
            console.error("Erreur création:", error);
            alert("Impossible de créer la réunion.");
        }
    };

    const joinMeeting = (e) => {
        e.preventDefault();
        if (roomIdInput.trim()) {
            navigate(`/room/${roomIdInput}`);
        }
    };

    const handleLogout = () => {
        logout(); // Utilise la fonction du contexte
        navigate('/');
    };

    return (
        <div style={styles.container}>
            {/* Header fixée en haut */}
            <header style={styles.header}>
                <div style={styles.logoGroup}>
                    <span style={{fontSize: '24px'}}>📹</span>
                    <h1 style={styles.title}>SmartMeet</h1>
                </div>
                <div style={styles.userGroup}>
                    <span style={styles.userName}>Bonjour, <strong>{username}</strong></span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Déconnexion</button>
                </div>
            </header>

            {/* Le Main prend tout le reste de l'espace */}
            <main style={styles.main}>
                <div style={styles.cardContainer}>
                    {/* Carte Création */}
                    <div style={styles.card}>
                        <div style={styles.iconBox}>📷</div>
                        <h2>Nouvelle Réunion</h2>
                        <p style={styles.cardText}>Lancez un appel vidéo et invitez d'autres personnes.</p>
                        <button onClick={createMeeting} style={styles.primaryBtn}>
                            Lancer une réunion
                        </button>
                    </div>

                    {/* Carte Rejoindre */}
                    <div style={styles.card}>
                        <div style={styles.iconBox}>🔗</div>
                        <h2>Rejoindre</h2>
                        <p style={styles.cardText}>Vous avez un code ? Entrez-le ci-dessous.</p>
                        <form onSubmit={joinMeeting} style={styles.form}>
                            <input 
                                type="text" 
                                placeholder="ex: 550e-8400..." 
                                value={roomIdInput}
                                onChange={(e) => setRoomIdInput(e.target.value)}
                                style={styles.input}
                            />
                            <button type="submit" style={styles.secondaryBtn}>Rejoindre</button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};


const styles = {
    container: {
        height: '100vh', 
        width: '100vw',  
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 
        overflow: 'hidden', 
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
        height: '70px', 
        padding: '0 30px',
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 10,
    },
    logoGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    title: {
        fontSize: '22px',
        color: '#333',
        margin: 0,
    },
    userGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    userName: {
        color: '#555',
        fontSize: '16px',
    },
    logoutBtn: {
        backgroundColor: '#ff4757',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background 0.3s',
    },
    main: {
        flex: 1, 
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',     
        padding: '20px',
    },
    cardContainer: {
        display: 'flex',
        gap: '40px', 
        flexWrap: 'wrap', 
        justifyContent: 'center',
        maxWidth: '1200px',
        width: '100%',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(10px)', 
        padding: '40px',
        borderRadius: '20px',
        width: '350px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'transform 0.2s',
    },
    iconBox: {
        fontSize: '40px',
        marginBottom: '15px',
        backgroundColor: '#eef2f7',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardText: {
        color: '#666',
        marginBottom: '25px',
        lineHeight: '1.5',
    },
    primaryBtn: {
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        width: '100%',
        boxShadow: '0 4px 6px rgba(0,123,255,0.3)',
    },
    form: {
        display: 'flex',
        width: '100%',
        gap: '10px',
    },
    input: {
        flex: 1,
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        outline: 'none',
        fontSize: '14px',
    },
    secondaryBtn: {
        backgroundColor: '#2ed573',
        color: '#fff',
        border: 'none',
        padding: '0 20px',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(46,213,115,0.3)',
    }
};

export default Dashboard;