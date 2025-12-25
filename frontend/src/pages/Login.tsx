import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const Login: React.FC = () => {
    const { login, user, loading } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // 🔒 RENDER GUARD
    if (!loading && user) {
        return <Navigate to="/posts" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            await login(email, password);
            navigate('/posts');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Eroare la autentificare.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <h2 className="auth-title">Autentificare</h2>

                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Parolă</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" disabled={submitting}>
                            {submitting ? 'Se autentifică...' : 'Autentifică-te'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Nu ai cont? <Link to="/register">Înregistrează-te</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;