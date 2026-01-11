import { useState, useCallback } from 'react';
import MapView from '../components/MapView';
import SearchBar from '../components/Sidebar';
import LocationButton from '../components/LocationButton';
import '../App.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, MessageSquarePlus } from 'lucide-react';
import FeedbackModal from '../components/FeedbackModal';
import logo from '../assets/logo.png';

export default function Home() {
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [locationActive, setLocationActive] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleGetUserLocation = useCallback(() => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsLocating(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);
                setLocationActive(true);
                setIsLocating(false);
            },
            (error) => {
                setIsLocating(false);
                let errorMessage = 'Unable to retrieve your location';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                }

                alert(errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }, []);

    return (
        <div className="w-full h-full relative">
            {/* Logo */}
            <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'white',
                padding: '8px 16px',
                borderRadius: '50px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                pointerEvents: 'none', // Allow clicks to pass through if it covers map interaction, though with this size it shouldn't be an issue
                userSelect: 'none'
            }}>
                <img
                    src={logo}
                    alt="SIT Campus Nav Logo"
                    style={{ height: '32px', width: 'auto' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
                    <span style={{ fontWeight: 700, fontSize: '15px', color: '#1a73e8' }}>SIT</span>
                    <span style={{ fontWeight: 600, fontSize: '11px', color: '#5f6368', letterSpacing: '0.5px' }}>CAMPUS NAV</span>
                </div>
            </div>

            <SearchBar onLocationSelect={setSelectedLocation} />

            {/* Auth Controls */}
            <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                zIndex: 1000,
                display: 'flex',
                gap: '0.5rem'
            }}>
                {user ? (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <span style={{ fontWeight: 500 }}>{user.name}</span>
                        <button
                            onClick={logout}
                            title="Logout"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                        >
                            <LogOut size={20} color="#4b5563" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'white',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            fontWeight: 500
                        }}
                    >
                        <LogIn size={20} />
                        Sign In
                    </button>
                )}
            </div>

            <div className="map-container">
                <MapView
                    selectedLocation={selectedLocation}
                    userLocation={userLocation}
                />
            </div>
            <LocationButton
                onClick={handleGetUserLocation}
                loading={isLocating}
                active={locationActive}
            />

            {/* Feedback Button */}
            {user && (
                <button
                    onClick={() => setIsFeedbackOpen(true)}
                    style={{
                        position: 'absolute',
                        bottom: '80px',
                        right: '20px',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        border: 'none',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 1000
                    }}
                    title="Give Feedback"
                >
                    <MessageSquarePlus size={20} color="#4b5563" />
                </button>
            )}

            <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
        </div>
    );
}
