import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

import Header from './components/Header';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import AdminDashboard from './pages/AdminDashboard';
import EditPost from './pages/EditPost';
import About from './pages/About';
import Contact from './pages/Contact';   
import ImplicaTe from './pages/ImplicaTe';
import InstallApp from './pages/InstallApp';

import './styles/global.css';

/* ================= PRIVATE ROUTE ================= */
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return user ? <>{children}</> : <Navigate to="/login" />;
};

/* ================= ADMIN ROUTE ================= */
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return user?.isAdmin ? <>{children}</> : <Navigate to="/posts" />;
};

/* ================= ROUTES ================= */
const AppRoutes: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />

            <main style={{ flex: 1 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} /> {/* ✅ FUNCȚIONAL */}
                    <Route path="/implica-te" element={<ImplicaTe />} />
                    <Route path="/install-app" element={<InstallApp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/posts" element={<Posts />} />
                    <Route path="/posts/:id" element={<PostDetail />} />

                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/create-post"
                        element={
                            <PrivateRoute>
                                <CreatePost />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/edit/:id"
                        element={
                            <AdminRoute>
                                <EditPost />
                            </AdminRoute>
                        }
                    />
                </Routes>
            </main>

            {/* Footer-ul tău real va veni aici */}
            <footer />
        </div>
    );
};

const App: React.FC = () => {
    return <AppRoutes />;
};

export default App;
