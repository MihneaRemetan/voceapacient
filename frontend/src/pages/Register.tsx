import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [county, setCounty] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

        setLoading(true);

        try {
            await register(email, password, name || undefined, county || undefined);
            navigate('/posts');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Eroare la înregistrare.');
        } finally {
            setLoading(false);
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
                            <label htmlFor="email" className="form-label">
                                Email *
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Parolă *
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                autoComplete="new-password"
                            />
                            <p className="form-help">Minim 6 caractere</p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirmă parola *
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                className="form-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="name" className="form-label">
                                Nume (opțional)
                            </label>
                            <input
                                id="name"
                                type="text"
                                className="form-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="county" className="form-label">
                                Județ (opțional)
                            </label>
                            <select
                                id="county"
                                className="form-select"
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

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? 'Se înregistrează...' : 'Înregistrează-te'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Ai deja cont?{' '}
                        <Link to="/login" className="auth-link">
                            Autentifică-te
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
