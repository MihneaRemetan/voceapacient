import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Post, postsApi, adminApi } from '../services/api';
import './EditPost.css';

const ROMANIAN_COUNTIES = [
    'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani',
    'Brașov', 'Brăila', 'București', 'Buzău', 'Caraș-Severin', 'Călărași',
    'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu',
    'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș',
    'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Satu Mare', 'Sălaj',
    'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vaslui', 'Vâlcea', 'Vrancea'
];

const EditPost: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [post, setPost] = useState<Post | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        body: '',
        unitName: '',
        locality: '',
        county: '',
        incidentDate: ''
    });

    const [uploadingImage, setUploadingImage] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Calculate min and max dates for validation
    const minDate = '2010-01-01';
    const maxDate = new Date().toISOString().split('T')[0]; // Today

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Use admin endpoint to fetch post regardless of status
                const response = await adminApi.getPostForEdit(Number(id));
                const postData = response.data;
                setPost(postData);
                setFormData({
                    title: postData.title || '',
                    body: postData.body,
                    unitName: postData.unitName,
                    locality: postData.locality,
                    county: postData.county,
                    incidentDate: postData.incidentDate || ''
                });
            } catch (err: any) {
                setError(err.response?.data?.error || 'Eroare la încărcarea postării.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        try {
            await adminApi.updatePost(Number(id), formData);
            setSuccess('Postare actualizată cu succes!');
            setTimeout(() => navigate('/admin'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Eroare la actualizarea postării.');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) return;

        setUploadingImage(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await adminApi.addAttachment(Number(id), formData);

            // Refresh post to get new attachment
            const updatedPost = await postsApi.getPostById(Number(id));
            setPost(updatedPost.data);
            setImageFile(null);
            setSuccess('Imagine adăugată cu succes!');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Eroare la încărcarea imaginii.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleDeleteAttachment = async (attachmentId: number) => {
        if (!window.confirm('Sigur vrei să ștergi această imagine?')) return;

        try {
            await adminApi.deleteAttachment(Number(id), attachmentId);

            // Refresh post
            const updatedPost = await postsApi.getPostById(Number(id));
            setPost(updatedPost.data);
            setSuccess('Imagine ștearsă cu succes!');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Eroare la ștergerea imaginii.');
        }
    };

    const handleDeletePost = async () => {
        if (!window.confirm('Sigur vrei să ștergi această postare? Această acțiune este permanentă și va șterge și toate imaginile și comentariile asociate.')) {
            return;
        }

        try {
            await adminApi.deletePost(Number(id));
            navigate('/admin');
            // Note: We navigate away so we don't need to show success message
        } catch (err: any) {
            setError(err.response?.data?.error || 'Eroare la ștergerea postării.');
        }
    };

    if (loading) {
        return (
            <div className="edit-post-page">
                <div className="container">
                    <div className="loading-state">Se încarcă...</div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="edit-post-page">
                <div className="container">
                    <div className="alert alert-error">Postare negăsită.</div>
                    <Link to="/admin" className="btn btn-outline">← Înapoi la Admin</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-post-page">
            <div className="container">
                <div className="page-header">
                    <h1>Editare Mărturie</h1>
                    <Link to="/admin" className="btn btn-outline">← Înapoi</Link>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="edit-post-content">
                    <div className="edit-form-section">
                        <h2>Detalii Mărturie</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Titlu (opțional)</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-input"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Ex: Experiență la UPU"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Unitate Medicală *</label>
                                <input
                                    type="text"
                                    name="unitName"
                                    className="form-input"
                                    value={formData.unitName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Localitate *</label>
                                    <input
                                        type="text"
                                        name="locality"
                                        className="form-input"
                                        value={formData.locality}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Județ *</label>
                                    <select
                                        name="county"
                                        className="form-select"
                                        value={formData.county}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Selectează județul</option>
                                        {ROMANIAN_COUNTIES.map(county => (
                                            <option key={county} value={county}>{county}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Data incidentului (opțional)</label>
                                <input
                                    type="date"
                                    name="incidentDate"
                                    className="form-input"
                                    value={formData.incidentDate}
                                    onChange={handleChange}
                                    min={minDate}
                                    max={maxDate}
                                />
                                <div className="form-help">
                                    Anul trebuie să fie între 2010 și prezent
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Descriere *</label>
                                <textarea
                                    name="body"
                                    className="form-textarea"
                                    rows={10}
                                    value={formData.body}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="form-help">
                                    {formData.body.length} caractere (minimum 30)
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Se salvează...' : 'Salvează Modificările'}
                                </button>
                                <Link to="/admin" className="btn btn-outline">
                                    Anulează
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleDeletePost}
                                    className="btn btn-danger"
                                    style={{ marginLeft: 'auto' }}
                                >
                                    Șterge Postarea
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="attachments-section">
                        <h2>Imagini Atașate</h2>

                        {post.attachments && post.attachments.length > 0 ? (
                            <div className="attachments-grid">
                                {post.attachments.map(attachment => (
                                    <div key={attachment.id} className="attachment-item">
                                        <img
                                            src={`http://localhost:5003/${attachment.file_path}`}
                                            alt="Attachment"
                                            className="attachment-preview"
                                        />
                                        <button
                                            onClick={() => handleDeleteAttachment(attachment.id)}
                                            className="btn btn-danger btn-sm"
                                        >
                                            Șterge
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted">Nicio imagine atașată.</p>
                        )}

                        <div className="upload-section">
                            <h3>Adaugă Imagine Nouă</h3>
                            <input
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                className="form-input"
                            />
                            {imageFile && (
                                <button
                                    onClick={handleImageUpload}
                                    className="btn btn-success btn-sm"
                                    disabled={uploadingImage}
                                >
                                    {uploadingImage ? 'Se încarcă...' : 'Încarcă Imagine'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPost;
