import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <header className="header">
            <div className="container header-content">
                
                {/* LOGO */}
                <Link to="/" className="header-logo">
                    <h1 className="logo-text">🏥 Vocea Pacientului</h1>
                </Link>

                {/* NAVIGAȚIE */}
                <nav className="header-nav">
                    <Link to="/about" className="nav-link">
                        Despre noi
                    </Link>

                    <Link to="/posts" className="nav-link">
                        Mărturii
                    </Link>

                    <Link to="/contact" className="nav-link">
                        Contact
                    </Link>

                    <Link to="/implica-te" className="nav-link">
                        Implică-te
                    </Link>

                    {user ? (
                        <>
                            <Link to="/create-post" className="nav-link">
                                Adaugă Mărturie
                            </Link>

                            {user.isAdmin && (
                                <Link to="/admin" className="nav-link">
                                    Admin
                                </Link>
                            )}

                            <Link to="/profile" className="nav-link">
                                Profil
                            </Link>

                            <button
                                onClick={logout}
                                className="btn btn-outline btn-sm"
                            >
                                Ieșire
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-primary btn-sm">
                                Autentificare
                            </Link>

                            <Link to="/register" className="btn btn-outline btn-sm">
                                Înregistrare
                            </Link>

                            <Link to="/install-app" className="btn btn-success btn-sm">
                                📱 Deschide în aplicație
                            </Link>
                        </>
                    )}
                </nav>

            </div>
        </header>
    );
};

export default Header;