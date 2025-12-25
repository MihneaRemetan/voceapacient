import React from 'react';
import { Reply } from '../services/api';
import './ReplyList.css';

interface ReplyListProps {
    replies: Reply[];
}

const ReplyList: React.FC<ReplyListProps> = ({ replies }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ro-RO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (replies.length === 0) {
        return (
            <div className="reply-list-empty">
                <p>Niciun comentariu încă.</p>
            </div>
        );
    }

    return (
        <div className="reply-list">
            <h4 className="reply-list-title">Comentarii ({replies.length})</h4>
            {replies.map((reply) => (
                <div key={reply.id} className="reply-item">
                    <div className="reply-header">
                        <span className="reply-author">{reply.displayName}</span>
                        <span className="reply-date">{formatDate(reply.created_at)}</span>
                    </div>
                    <p className="reply-body">{reply.body}</p>
                </div>
            ))}
        </div>
    );
};

export default ReplyList;
