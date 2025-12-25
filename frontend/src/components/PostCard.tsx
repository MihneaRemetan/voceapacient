import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../services/api';
import './PostCard.css';

interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ro-RO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="post-card">
            <Link to={`/posts/${post.id}`} className="post-card-link">
                {post.title && <h3 className="post-card-title">{post.title}</h3>}

                <p className="post-card-body">{post.body}</p>

                <div className="post-card-meta">
                    <div className="post-card-location">
                        <span className="location-icon">📍</span>
                        <span>{post.unitName}, {post.locality}, {post.county}</span>
                    </div>

                    {post.incidentDate && (
                        <div className="post-card-date">
                            <span className="date-icon">📅</span>
                            <span>{formatDate(post.incidentDate)}</span>
                        </div>
                    )}
                </div>

                <div className="post-card-footer">
                    <span className="post-author">{post.displayName}</span>
                    <div className="post-stats">
                        {post.attachmentCount !== undefined && post.attachmentCount > 0 && (
                            <span className="stat-item">
                                📎 {post.attachmentCount}
                            </span>
                        )}
                        {post.replyCount !== undefined && (
                            <span className="stat-item">
                                💬 {post.replyCount}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default PostCard;
