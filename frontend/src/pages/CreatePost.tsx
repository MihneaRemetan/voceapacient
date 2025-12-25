import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { postsApi } from '../services/api';
import './CreatePost.css';

const CreatePost: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [unitName, setUnitName] = useState('');
    const [locality, setLocality] = useState('');
    const [county, setCounty] = useState('');
    const [incidentDate, setIncidentDate] = useState('');
    const [useRealName, setUseRealName] = useState(false);
    const [images, setImages] = useState<FileList | null>(null);
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

    React.useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (body.trim().length < 30) {
            setError('Descrierea trebuie să aibă minim 30 de caractere.');
            return;
        }

        if (!unitName || !locality || !county) {
            setError('Spitalul, localitatea și județul sunt obligatorii.');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            if (title) formData.append('title', title);
            formData.append('body', body);
            formData.append('unitName', unitName);
            formData.append('locality', locality);
            formData.append('county', county);
            if (incidentDate) formData.append('incidentDate', incidentDate);
            formData.append('useRealName', useRealName.toString());

            if (images) {
                for (let i = 0; i < images.length; i++) {
                    formData.append('images', images[i]);
                }
            }

            await postsApi.createPost(formData);
            navigate('/posts');
            alert('Mărturie trimisă cu succes! Va fi vizibilă după aprobarea administratorului.');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Eroare la crearea mărturiei.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="create-post-page">
            <div className="container container-md">
                <div className="create-post-card">
                    <h2 className="create-post-title">Adaugă o mărturie</h2>
                    <p className="create-post-subtitle">
                        Împărtășește experiența ta din spital. Mărturiile sunt revizuite înainte
                        de publicare pentru a asigura calitatea platformei.
                    </p>

                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="title" className="form-label">
                                Titlu (opțional)
                            </label>
                            <input
                                id="title"
                                type="text"
                                className="form-input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Experiență negativă la UPU"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="unitName" className="form-label">
                                Spital / Unitate medicală *
                            </label>
                            <input
                                id="unitName"
                                type="text"
                                className="form-input"
                                value={unitName}
                                onChange={(e) => setUnitName(e.target.value)}
                                required
                                placeholder="Ex: Spitalul Județean Arad"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="locality" className="form-label">
                                    Localitate *
                                </label>
                                <input
                                    id="locality"
                                    type="text"
                                    className="form-input"
                                    value={locality}
                                    onChange={(e) => setLocality(e.target.value)}
                                    required
                                    placeholder="Ex: Arad"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="county" className="form-label">
                                    Județ *
                                </label>
                                <select
                                    id="county"
                                    className="form-select"
                                    value={county}
                                    onChange={(e) => setCounty(e.target.value)}
                                    required
                                >
                                    <option value="">Selectează județul</option>
                                    {romanianCounties.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="incidentDate" className="form-label">
                                Data incidentului (opțional)
                            </label>
                            <input
                                id="incidentDate"
                                type="date"
                                className="form-input"
                                value={incidentDate}
                                onChange={(e) => setIncidentDate(e.target.value)}
                                min="2010-01-01"
                                max={new Date().toISOString().split('T')[0]}
                            />
                            <p className="form-help">
                                Anul trebuie să fie între 2010 și prezent
                            </p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="body" className="form-label">
                                Descriere *
                            </label>
                            <textarea
                                id="body"
                                className="form-textarea"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                required
                                placeholder="Descrie experiența ta în detaliu (minim 30 de caractere)..."
                                style={{ minHeight: '180px' }}
                            />
                            <p className="form-help">
                                {body.length} caractere (minim 30)
                            </p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="images" className="form-label">
                                Imagini (opțional, max 5MB per imagine)
                            </label>
                            <input
                                id="images"
                                type="file"
                                className="form-input"
                                accept="image/jpeg,image/png,image/jpg"
                                multiple
                                onChange={(e) => setImages(e.target.files)}
                            />
                            <p className="form-help">
                                Poți încărca JPEG sau PNG. Selectează multiple imagini dacă este necesar.
                            </p>
                        </div>

                        {user.showRealName && user.name && (
                            <div className="form-checkbox">
                                <input
                                    type="checkbox"
                                    id="useRealName"
                                    checked={useRealName}
                                    onChange={(e) => setUseRealName(e.target.checked)}
                                />
                                <label htmlFor="useRealName">
                                    Publică sub numele meu real ({user.name})
                                </label>
                            </div>
                        )}

                        <div className="info-box">
                            <p>
                                📌 Mărturiile sunt revizuite de un administrator înainte de a fi
                                publicate. Vei fi notificat când mărturie este aprobată.
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? 'Se trimite...' : 'Trimite mărturie'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
