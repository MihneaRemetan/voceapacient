import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../services/api';
import './Profile.css';

const Profile: React.FC = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.name || '');
    const [county, setCounty] = useState(user?.county || '');
    const [showRealName, setShowRealName] = useState(user?.showRealName || false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const romanianCounties = [
        'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani',
        'Brăila', 'Brașov', 'București', 'Buzău', 'Călărași', 'Caraș-Severin',
        'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu',
        'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș',
        'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Sălaj', 'Satu Mare',
        'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vâlcea', 'Vaslui', 'Vrancea'
    ];

    React.useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await userApi.updateProfile({
                name: name || undefined,
                county: county || undefined,
                showRealName,
            });

            updateUser(response.data.user);
            setSuccess('Profil actualizat cu succes!');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Eroare la actualizarea profilului.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="profile-page">
            <div className="container container-md">
                <div className="profile-card">
                    <h2 className="profile-title">Profilul meu</h2>

                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="form-input"
                                value={user.email}
                                disabled
                            />
                            <p className="form-help">Email-ul nu poate fi modificat</p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="name" className="form-label">
                                Nume
                            </label>
                            <input
                                id="name"
                                type="text"
                                className="form-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <p className="form-help">
                                Numele tău real (va fi afișat doar dacă alegi această opțiune)
                            </p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="county" className="form-label">
                                Județ
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

                        <div className="form-group">
                            <div className="form-checkbox">
                                <input
                                    type="checkbox"
                                    id="showRealName"
                                    checked={showRealName}
                                    onChange={(e) => setShowRealName(e.target.checked)}
                                />
                                <label htmlFor="showRealName">
                                    <strong>Afișează numele meu real la postări și comentarii</strong>
                                    <span className="form-help-inline">
                                        (Dacă această opțiune este dezactivată, vei apărea ca "Anonim"
                                        chiar dacă ai completat numele)
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="profile-info-box">
                            <h4>📌 Despre anonimat</h4>
                            <ul>
                                <li>
                                    Această setare este <strong>preferința ta globală</strong>.
                                </li>
                                <li>
                                    La fiecare postare sau comentariu poți alege individual dacă
                                    dorești să folosești numele real.
                                </li>
                                <li>
                                    Chiar dacă această opțiune este activată aici, poți rămâne
                                    anonim la postări specifice.
                                </li>
                            </ul>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? 'Se salvează...' : 'Salvează modificările'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
