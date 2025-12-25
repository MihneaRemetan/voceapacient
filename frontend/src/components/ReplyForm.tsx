import React, { useState } from 'react';
import { repliesApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './ReplyForm.css';

interface ReplyFormProps {
    postId: number;
    onReplyAdded: () => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ postId, onReplyAdded }) => {
    const { user } = useAuth();
    const [body, setBody] = useState('');
    const [useRealName, setUseRealName] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!body.trim()) {
            setError('Comentariul nu poate fi gol.');
            return;
        }

        if (body.length > 500) {
            setError('Comentariul nu poate depăși 500 de caractere.');
            return;
        }

        setLoading(true);

        try {
            await repliesApi.createReply(postId, { body, useRealName });
            setBody('');
            setUseRealName(false);
            onReplyAdded();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Eroare la adăugarea comentariului.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="reply-form-login">
                <p>Trebuie să fii autentificat pentru a adăuga un comentariu.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="reply-form">
            <h4 className="reply-form-title">Adaugă un comentariu</h4>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
                <textarea
                    className="form-textarea"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Comentariul tău (max 500 caractere)..."
                    maxLength={500}
                />
                <div className="char-counter">
                    {body.length} / 500 caractere
                </div>
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
                        Afișează numele meu real ({user.name})
                    </label>
                </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Se trimite...' : 'Trimite comentariu'}
            </button>
        </form>
    );
};

export default ReplyForm;
