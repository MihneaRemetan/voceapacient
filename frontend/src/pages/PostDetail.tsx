import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsApi, adminApi, Post } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ReplyList from '../components/ReplyList';
import ReplyForm from '../components/ReplyForm';
import './PostDetail.css';

const PostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await postsApi.getPostById(Number(id));
                setPost(response.data);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Eroare la încărcarea postării.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPost();
        }
    }, [id]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ro-RO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleReplyAdded = () => {
        // Refresh post to get updated replies
        const fetchPost = async () => {
            try {
                const response = await postsApi.getPostById(Number(id));
                setPost(response.data);
            } catch (err: any) {
                console.error('Error refreshing post:', err);
            }
        };

        fetchPost();
    };

    const handleDeletePost = async () => {
        if (!window.confirm('Sigur vrei să ștergi această postare? Această acțiune este permanentă.')) {
            return;
        }

        setDeleting(true);
        try {
            await adminApi.deletePost(Number(id));
            navigate('/posts');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Eroare la ștergerea postării.');
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="post-detail-page">
                <div className="container">
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="post-detail-page">
                <div className="container">
                    <div className="alert alert-error">{error || 'Mărturie negăsită.'}</div>
                    <Link to="/posts" className="btn btn-outline">
                        ← Înapoi la mărturii
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="post-detail-page">
            <div className="container container-md">
                <article className="post-detail">
                    <div className="post-detail-header">
                        <h1 className="post-detail-title">{post.title}</h1>

                        {user?.isAdmin && (
                            <button
                                onClick={handleDeletePost}
                                className="btn btn-danger"
                                disabled={deleting}
                            >
                                {deleting ? 'Se șterge...' : 'Șterge postarea'}
                            </button>
                        )}

                        <div className="post-detail-meta">
                            <div className="meta-item">
                                <span className="meta-icon">👤</span>
                                <span>{post.displayName}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-icon">🕒</span>
                                <span>Publicat: {formatDate(post.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="post-detail-body">
                        {post.body.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>

                    {post.attachments && post.attachments.length > 0 && (
                        <div className="post-attachments">
                            <h3 className="attachments-title">Imagini atașate</h3>
                            <div className="attachments-grid">
                                {post.attachments.map((attachment) => (
                                    <a
                                        key={attachment.id}
                                        href={`http://localhost:5003/${attachment.file_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="attachment-link"
                                    >
                                        <img
                                            src={`http://localhost:5003/${attachment.file_path}`}
                                            alt="Attachment"
                                            className="attachment-image"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {post.replies && <ReplyList replies={post.replies} />}

                    <ReplyForm postId={post.id} onReplyAdded={handleReplyAdded} />
                </article>
            </div>
        </div>
    );
};

export default PostDetail;
