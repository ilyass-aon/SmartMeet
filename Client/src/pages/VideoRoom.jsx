import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VideoRoom = () => {
    const { roomId } = useParams(); // ID de la salle depuis l'URL
    const navigate = useNavigate();
    
    
    const [stream, setStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);

    
    const myVideo = useRef();

    useEffect(() => {
        // acces au camera et au micro au chargement
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                // On injecte le flux dans la balise <video>
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }
            })
            .catch((err) => {
                console.error("Erreur accès caméra:", err);
                alert("Impossible d'accéder à la caméra/micro. Vérifiez vos permissions.");
            });

        // Eteindre le stream
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // --- Fonctions de Contrôle ---

    const toggleMute = () => {
        if (stream) {
            // Active/Désactive la piste audio
            stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
            setIsMuted(!isMuted);
        }
    };

    const toggleCamera = () => {
        if (stream) {
            // Active/Désactive la piste vidéo
            stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
            setIsCameraOff(!isCameraOff);
        }
    };

    const leaveRoom = () => {
        // On coupe tout et on retourne au Dashboard
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        navigate('/dashboard');
    };

    return (
        <div style={styles.roomContainer}>
            <div style={styles.header}>
                <h3 style={{color: 'white'}}>Salle : {roomId}</h3>
            </div>

            <div style={styles.videoGrid}>
                {/* MA VIDÉO (Local) */}
                <div style={styles.videoWrapper}>
                    <video 
                        playsInline 
                        muted 
                        ref={myVideo} 
                        autoPlay 
                        style={styles.video} 
                    />
                    <span style={styles.nameTag}>Moi</span>
                </div>

                {/* PLACEHOLDER POUR L'INVITÉ (On le remplira à la prochaine étape) */}
                <div style={{...styles.videoWrapper, backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <p style={{color: '#aaa'}}>En attente d'un participant...</p>
                </div>
            </div>

            {/* BARRE DE CONTRÔLE */}
            <div style={styles.controls}>
                <button onClick={toggleMute} style={{...styles.controlBtn, background: isMuted ? '#ff4757' : '#3c40c6'}}>
                    {isMuted ? 'Micro OFF 🔇' : 'Micro ON 🎤'}
                </button>
                
                <button onClick={toggleCamera} style={{...styles.controlBtn, background: isCameraOff ? '#ff4757' : '#3c40c6'}}>
                    {isCameraOff ? 'Caméra OFF 📷' : 'Caméra ON 📷'}
                </button>
                
                <button onClick={leaveRoom} style={{...styles.controlBtn, background: '#ff4757'}}>
                    Raccrocher 📞
                </button>
            </div>
        </div>
    );
};

// --- STYLES "DARK MODE"  ---
const styles = {
    roomContainer: {
        height: '100vh',
        width: '100vw',
        backgroundColor: '#1e272e', // Fond sombre
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px',
    },
    header: {
        marginBottom: '10px',
    },
    videoGrid: {
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        height: '70%',
    },
    videoWrapper: {
        position: 'relative',
        width: '45%', // Prend presque la moitié de l'écran
        minWidth: '300px',
        height: '100%',
        backgroundColor: 'black',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
    },
    video: {
        width: '100%',
        height: '100%',
        objectFit: 'cover', // Remplit bien le cadre
        transform: 'scaleX(-1)', // Effet miroir pour se voir naturellement
    },
    nameTag: {
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '5px 10px',
        borderRadius: '5px',
        fontSize: '14px',
    },
    controls: {
        display: 'flex',
        gap: '15px',
        backgroundColor: '#2f3640',
        padding: '15px',
        borderRadius: '30px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    },
    controlBtn: {
        padding: '12px 20px',
        border: 'none',
        borderRadius: '20px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '14px',
        transition: '0.3s',
    }
};

export default VideoRoom;