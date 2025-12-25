import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminApi, Post } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (!user.isAdmin) {
            navigate('/posts');
        } else {
            fetchPendingPosts();
        }
    }, [user, navigate]);

    const fetchPendingPosts = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await adminApi.getPendingPosts();
            setPosts(response.data.posts);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Eroare la încărcarea postărilor.');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        if (!confirm('Sigur vrei să aprobi această mărturie?')) {
            return;
        }

        setProcessingId(id);

        try {
            await adminApi.approvePost(id);
            setPosts(posts.filter((p) => p.id !== id));
            alert('Mărturie aprobată cu succes!');
        } catch (err: any) {
            alert(err.response?.data?.error || 'Eroare la aprobarea mărturiei.');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: number) => {
        if (!confirm('Sigur vrei să respingi această mărturie? Această acțiune este permanentă.')) {
            return;
        }

        setProcessingId(id);

        try {
            await adminApi.rejectPost(id);
            setPosts(posts.filter((p) => p.id !== id));
            alert('Mărturie respinsă.');
        } catch (err: any) {
            alert(err.response?.data?.error || 'Eroare la respingerea mărturiei.');
        } finally {
            setProcessingId(null);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ro-RO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!user || !user.isAdmin) {
        return null;
    }

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h2 className="admin-title">Panou Administrator</h2>
                    <p className="admin-subtitle">
                        Revizuiește și aprobă mărturiile trimise de utilizatori
                    </p>
                </div>

                {loading && (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                )}

                {error && <div className="alert alert-error">{error}</div>}

                {!loading && !error && posts.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">✅</div>
                        <h3>Nicio mărturie în așteptare</h3>
                        <p>Toate mărturiile au fost procesate. Bună treabă!</p>
                    </div>
                )}

                {!loading && !error && posts.length > 0 && (
                    <div className="admin-posts">
                        <div className="admin-count">
                            {posts.length} {posts.length === 1 ? 'mărturie' : 'mărturii'} în așteptare
                        </div>

                        {posts.map((post) => (
                            <div key={post.id} className="admin-post-card">
                                <div className="admin-post-header">
                                    <div>
                                        {post.title && <h3 className="admin-post-title">{post.title}</h3>}
                                        <div className="admin-post-meta">
                                            <span className="meta-badge">{post.displayName}</span>
                                            <span className="meta-text">
                                                {post.unitName}, {post.locality}, {post.county}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="badge badge-warning">Pending</span>
                                </div>

                                <div className="admin-post-body">
                                    {post.body}
                                </div>

                                {post.incidentDate && (
                                    <div className="admin-post-date">
                                        📅 Data incidentului: {formatDate(post.incidentDate)}
                                    </div>
                                )}

                                {post.attachmentCount && post.attachmentCount > 0 && (
                                    <div className="admin-post-attachments">
                                        📎 {post.attachmentCount} {post.attachmentCount === 1 ? 'imagine' : 'imagini'} atașate
                                    </div>
                                )}

                                <div className="admin-post-footer">
                                    <span className="admin-post-submitted">
                                        Trimisă la: {formatDate(post.createdAt)}
                                    </span>
                                    <div className="admin-post-actions">
                                        <button
                                            onClick={() => handleReject(post.id)}
                                            className="btn btn-danger btn-sm"
                                            disabled={processingId === post.id}
                                        >
                                            Respinge
                                        </button>
                                        <button
                                            onClick={() => handleApprove(post.id)}
                                            className="btn btn-success btn-sm"
                                            disabled={processingId === post.id}
                                        >
                                            Aprobă
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
