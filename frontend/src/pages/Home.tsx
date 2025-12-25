import React from 'react';
import { Link } from 'react-router-dom';
import { Post, postsApi } from '../services/api';
import './Home.css';

const Home: React.FC = () => {
    const [latestPosts, setLatestPosts] = React.useState<Post[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await postsApi.getPosts({ limit: 3 });
                setLatestPosts(response.data.posts);
            } catch (error) {
                console.error('Error fetching latest posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="home-page">
            {/* 1. Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">VOCEA PACIENTULUI</h1>
                        <p className="hero-subtitle">
                            Platformă civică pentru relatări reale din spitalele din România.
                        </p>
                        <Link to="/posts" className="btn btn-primary btn-lg">
                            Vezi mărturiile
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. Mission Section */}
            <section className="mission-section">
                <div className="container">
                    <h2 className="section-title">Misiunea Noastră</h2>
                    <div className="mission-grid">
                        <div className="mission-card">
                            <div className="mission-icon">📢</div>
                            <h3>Colectăm experiențe reale</h3>
                            <p>Oferim un spațiu sigur pentru ca pacienții să își facă auzită vocea și să semnaleze neregulile.</p>
                        </div>
                        <div className="mission-card">
                            <div className="mission-icon">📊</div>
                            <h3>Analizăm problemele</h3>
                            <p>Structurăm datele pentru a identifica problemele sistemice din spitalele românești.</p>
                        </div>
                        <div className="mission-card">
                            <div className="mission-icon">⚖️</div>
                            <h3>Luptăm pentru transparență</h3>
                            <p>Promovăm responsabilitatea și transparența în sistemul medical prin presiune civică.</p>
                        </div>
                    </div>
                </div>
            </section>  

            {/* 3. Latest Posts Section */}
            <section className="latest-posts-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Ultimele mărturii</h2>
                        <Link to="/posts" className="btn btn-outline btn-sm">
                            Vezi toate
                        </Link>
                    </div>

                    {loading ? (
                        <div className="loading-state">Se încarcă mărturiile...</div>
                    ) : (
                        <div className="latest-posts-grid">
                            {latestPosts.map((post) => (
                                <Link to={`/posts/${post.id}`} key={post.id} className="latest-post-card">
                                    <div className="post-location-badge">
                                        📍 {post.county}
                                    </div>
                                    <h3 className="post-title">{post.title || 'Mărturie fără titlu'}</h3>
                                    <p className="post-excerpt">
                                        {post.body.length > 150
                                            ? `${post.body.substring(0, 150)}...`
                                            : post.body}
                                    </p>
                                    <div className="post-footer">
                                        <span className="read-more">Citește tot &rarr;</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* 4. CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Cum poți ajuta?</h2>
                        <p className="cta-description">
                            Schimbarea începe cu o singură voce. Dacă ai trecut printr-o experiență
                            care merită povestită, nu o ține pentru tine.
                        </p>
                        <Link to="/create-post" className="btn btn-light btn-lg">
                            Trimite o mărturie
                        </Link>
                    </div>
                </div>
            </section>

            {/* 6. Footer / Association Info */}
            <footer className="site-footer">
                <div className="footer-columns">

                    {/* ================== COLOANA STÂNGA ================== */}
                    <div className="footer-col">
                    <h3 className="contact-title">CONTACT</h3>

                    <div className="contact-list">

                        <div className="contact-item">
                        <span className="contact-icon">🏢</span>
                        <span>Remețan Mihnea-Florin PFA</span>
                        </div>

                        <div className="contact-item">
                        <span className="contact-icon">🧾</span>
                        <span>CUI: 49248980</span>
                        </div>

                        <div className="contact-item">
                        <span className="contact-icon">📨</span>
                        <a href="mailto:mihnearemetan@gmail.com">
                            mihnearemetan@gmail.com
                        </a>
                        </div>

                        <div className="contact-item">
                        <span className="contact-icon">📞</span>
                        <a href="tel:+40728146170">
                            +40 728 146 170
                        </a>
                        </div>

                        <div className="contact-item">
                        <span className="contact-icon">🏠</span>
                        <span>
                            Piața Bibici Margareta, nr. 5, ap. 3,<br />
                            Arad, jud. Arad, România
                        </span>
                        </div>

                    </div>
                    </div>

                    {/* ================== COLOANA DREAPTA ================== */}
                    <div className="footer-col">
                        <h3 className="contact-title">URMĂREȘTE-NE</h3>

                        <div className="contact-social">
                            <a
                            href="https://www.facebook.com/mihnea.remetan"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon"
                            aria-label="Facebook"
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        fill="currentColor"
                                        d="M22 12a10 10 0 1 0-11.6 9.9v-7H8v-3h2.4V9.5
                                            c0-2.4 1.4-3.7 3.6-3.7 1 0 2 .1 2 .1v2.2h-1.2
                                            c-1.2 0-1.6.8-1.6 1.6V11H16l-.4 3h-2.2v7A10 10 0 0 0 22 12z"
                                    />
                                </svg>
                            </a>

                            <a
                            href="https://www.instagram.com/mihnea_remetan/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon"
                            aria-label="Instagram"
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                    fill="currentColor"
                                    d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10
                                        c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10
                                        2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7
                                        c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5
                                        3.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12
                                        7.5zm0 7.4A2.9 2.9 0 1 1 14.9 12 2.9 2.9 0
                                        0 1 12 14.9zM17.8 6.2a1.1 1.1 0 1 0 1.1
                                        1.1 1.1 1.1 0 0 0-1.1-1.1z"
                                    />
                                </svg>
                            </a>
                        </div>
                        </div>


                </div>
                </footer>


        </div>
    );
};

export default Home;
