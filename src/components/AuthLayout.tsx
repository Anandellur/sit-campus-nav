import { useState, useEffect } from 'react';
import '../styles/AuthLayout.css';
import logo from '../assets/logo.png';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    const [animationState, setAnimationState] = useState<'intro' | 'split'>('intro');

    useEffect(() => {
        // Start animation after a short delay
        const timer = setTimeout(() => {
            setAnimationState('split');
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`auth-layout ${animationState}`}>
            {/* Logo Section - Animates from center to left */}
            <div className="auth-logo-section">
                <div className="logo-container">
                    <img src={logo} alt="SIT Campus Nav" className="auth-logo" />
                    <div className="logo-text">
                        <h1>SIT</h1>
                        <span>CAMPUS NAV</span>
                    </div>
                </div>
            </div>

            {/* Content Section - Fades in on the right */}
            <div className="auth-content-section">
                <div className="auth-content-wrapper">
                    <h1 className="auth-title">{title}</h1>
                    <p className="auth-subtitle">{subtitle}</p>
                    {children}
                </div>
            </div>
        </div>
    );
}
