import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const Register: React.FC = () => {
    const { register, user, loading } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [county, setCounty] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // 🔒 RENDER GUARD
    if (!loading && user) {
        return <Navigate to="/posts" replace />;
    }

    const romanianCounties = [
        'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani',
        'Brăila', 'Brașov', 'București', 'Buzău', 'Călărași', 'Caraș-Severin',
        'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu',
        'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș',
        'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Sălaj', 'Satu Mare',
        'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vâlcea', 'Vaslui', 'Vrancea'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Parolele nu coincid.');
            return;
        }

        if (password.length < 6) {
            setError('Parola trebuie să aibă cel puțin 6 caractere.');
            return;
        }

        setSubmitting(true);

        try {
            await register(email, password, name || undefined, county || undefined);
            navigate('/posts');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Eroare la înregistrare.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <h2 className="auth-title">Înregistrare</h2>
                    <p className="auth-subtitle">
                        Creează un cont pentru a împărtăși experiența ta
                    </p>

                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Parolă *</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirmă parola *</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Nume (opțional)</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Județ (opțional)</label>
                            <select
                                value={county}
                                onChange={(e) => setCounty(e.target.value)}
                            >
                                <option value="">Selectează județul</option>
                                {romanianCounties.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" disabled={submitting}>
                            {submitting ? 'Se înregistrează...' : 'Înregistrează-te'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Ai deja cont? <Link to="/login">Autentifică-te</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;