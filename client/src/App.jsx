import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Products from './pages/Products';
import Booking from './pages/Booking';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminNavbar from './components/AdminNavbar';
import AdminAppointments from './pages/admin/Appointments';
import AdminServices from './pages/admin/Services';
import AdminGallery from './pages/admin/Gallery';
import AdminProducts from './pages/admin/Products';
import AdminCategories from './pages/admin/Categories';
import AdminMessages from './pages/admin/Messages';
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

function AppContent() {
    const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH;
    const { i18n } = useTranslation();
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith(ADMIN_PATH);
    const isLoginPage = location.pathname === `${ADMIN_PATH}/login`;

    useEffect(() => {
        document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    }, [i18n.language]);

    return (
        <div className={`app-container ${i18n.language === 'ar' ? 'rtl' : ''}`}>
            <ScrollToTop />
            <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
            {!isAdminRoute && <Navbar />}
            {isAdminRoute && !isLoginPage && <AdminNavbar />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/products" element={<Products />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/booking" element={<Booking />} />

                <Route path={ADMIN_PATH} element={<Navigate to={`${ADMIN_PATH}/login`} replace />} />
                <Route path={`${ADMIN_PATH}/login`} element={<AdminLogin />} />
                <Route path={`${ADMIN_PATH}/dashboard`} element={<ProtectedRoute adminPath={ADMIN_PATH}><AdminDashboard /></ProtectedRoute>} />
                <Route path={`${ADMIN_PATH}/appointments`} element={<ProtectedRoute adminPath={ADMIN_PATH}><AdminAppointments /></ProtectedRoute>} />
                <Route path={`${ADMIN_PATH}/services`} element={<ProtectedRoute adminPath={ADMIN_PATH}><AdminServices /></ProtectedRoute>} />
                <Route path={`${ADMIN_PATH}/gallery`} element={<ProtectedRoute adminPath={ADMIN_PATH}><AdminGallery /></ProtectedRoute>} />
                <Route path={`${ADMIN_PATH}/products`} element={<ProtectedRoute adminPath={ADMIN_PATH}><AdminProducts /></ProtectedRoute>} />
                <Route path={`${ADMIN_PATH}/categories`} element={<ProtectedRoute adminPath={ADMIN_PATH}><AdminCategories /></ProtectedRoute>} />
                <Route path={`${ADMIN_PATH}/messages`} element={<ProtectedRoute adminPath={ADMIN_PATH}><AdminMessages /></ProtectedRoute>} />

                {/* 404 Route - Must be last */}
                <Route path="*" element={<NotFound />} />
            </Routes>
            {!isAdminRoute && <Footer />}
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
