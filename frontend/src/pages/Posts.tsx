import React, { useState, useEffect } from 'react';
import { postsApi, Post } from '../services/api';
import PostCard from '../components/PostCard';
import './Posts.css';

const Posts: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [countyFilter, setCountyFilter] = useState('');
    const [unitNameFilter, setUnitNameFilter] = useState('');

    const romanianCounties = [
        'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani',
        'Brăila', 'Brașov', 'București', 'Buzău', 'Călărași', 'Caraș-Severin',
        'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu',
        'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș',
        'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Sălaj', 'Satu Mare',
        'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vâlcea', 'Vaslui', 'Vrancea'
    ];

    useEffect(() => {
        fetchPosts();
    }, [countyFilter, unitNameFilter]);

    const fetchPosts = async () => {
        setLoading(true);
        setError('');

        try {
            const params: any = {};
            if (countyFilter) params.county = countyFilter;
            if (unitNameFilter) params.unitName = unitNameFilter;

            const response = await postsApi.getPosts(params);
            setPosts(response.data.posts);
        } catch (err: any) {
            setError('Eroare la încărcarea mărturiilor.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetFilters = () => {
        setCountyFilter('');
        setUnitNameFilter('');
    };

    return (
        <div className="posts-page">
            <div className="container">
                <div className="posts-header">
                    <h2 className="posts-title">Mărturii din spitale</h2>
                    <p className="posts-subtitle">
                        Experiențe reale împărtășite de pacienți din spitalele din România
                    </p>
                </div>

                <div className="filters-card">
                    <h3 className="filters-title">Filtrează mărturiile</h3>
                    <div className="filters-grid">
                        <div className="form-group">
                            <label htmlFor="county" className="form-label">
                                Județ
                            </label>
                            <select
                                id="county"
                                className="form-select"
                                value={countyFilter}
                                onChange={(e) => setCountyFilter(e.target.value)}
                            >
                                <option value="">Toate județele</option>
                                {romanianCounties.map((county) => (
                                    <option key={county} value={county}>
                                        {county}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="unitName" className="form-label">
                                Spital
                            </label>
                            <input
                                id="unitName"
                                type="text"
                                className="form-input"
                                placeholder="Caută după nume spital..."
                                value={unitNameFilter}
                                onChange={(e) => setUnitNameFilter(e.target.value)}
                            />
                        </div>
                    </div>

                    {(countyFilter || unitNameFilter) && (
                        <button
                            onClick={handleResetFilters}
                            className="btn btn-outline btn-sm"
                        >
                            Resetează filtrele
                        </button>
                    )}
                </div>

                {loading && (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                )}

                {error && <div className="alert alert-error">{error}</div>}

                {!loading && !error && posts.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <h3>Nicio mărturie găsită</h3>
                        <p>
                            {countyFilter || unitNameFilter
                                ? 'Încearcă să modifici filtrele pentru a găsi mărturii.'
                                : 'Nu există încă mărturii publicate. Fii primul care împărtășește o experiență.'}
                        </p>
                    </div>
                )}

                {!loading && !error && posts.length > 0 && (
                    <div className="posts-list">
                        <div className="posts-count">
                            {posts.length} {posts.length === 1 ? 'mărturie găsită' : 'mărturii găsite'}
                        </div>
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Posts;
