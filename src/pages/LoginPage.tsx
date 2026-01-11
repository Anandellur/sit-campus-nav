import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import '../styles/Auth.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple validation
        if (!email || !name) return;

        login(email, name);
        navigate('/');
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to access campus navigation"
        >
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="name">Full Name</label>
                    <input
                        id="name"
                        type="text"
                        className="form-input"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        className="form-input"
                        placeholder="name@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="auth-button">
                    Sign In
                </button>
            </form>

            <p className="auth-link">
                Don't have an account? <Link to="/register">Sign up</Link>
            </p>
        </AuthLayout>
    );
}
