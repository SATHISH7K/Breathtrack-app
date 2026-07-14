import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Bell, UserCircle, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../api/apiService';
import LogoutModal from '../components/LogoutModal';
import './PatientLayout.css';

interface PatientLayoutProps {
    children: React.ReactNode;
}

const PatientLayout: React.FC<PatientLayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [hasUpdate, setHasUpdate] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/select-role');
    };

    useEffect(() => {
        const checkStatus = async () => {
            if (user?.id) {
                // If we are already on reminders page, clear the update flag
                if (location.pathname === '/patient/reminders') {
                    setHasUpdate(false);
                    return;
                }

                try {
                    const response = await apiCall('get_appointment.php', 'POST', { patient_id: user.id });
                    if (response.status === 'success' && response.appointment?.status?.toLowerCase() === 'accepted') {
                        setHasUpdate(true);
                    }
                } catch (err) {
                    console.error('Failed to check notification status');
                }
            }
        };

        checkStatus();
        // Check every 30 seconds for background updates
        const interval = setInterval(checkStatus, 30000);
        return () => clearInterval(interval);
    }, [user, location.pathname]);

    const navItems = [
        { icon: <LayoutDashboard size={22} />, label: 'Dashboard', path: '/patient/dashboard' },
        { icon: <Calendar size={22} />, label: 'Appointment', path: '/patient/appointments' },
        {
            icon: (
                <div style={{ position: 'relative' }}>
                    <Bell size={22} />
                    {hasUpdate && <span className="notification-dot"></span>}
                </div>
            ),
            label: 'Reminders',
            path: '/patient/reminders'
        },
        { icon: <UserCircle size={22} />, label: 'Profile', path: '/patient/profile' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="patient-layout">
            {/* Desktop Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo" onClick={() => navigate('/patient/dashboard')} style={{ cursor: 'pointer' }}>
                    <div className="logo-icon">🫁</div>
                    <span className="logo-text">BreathTrack</span>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <div
                            key={item.path}
                            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="nav-item logout" onClick={() => setShowLogoutModal(true)}>
                        <span className="nav-icon"><LogOut size={22} /></span>
                        <span className="nav-label">Logout</span>
                    </div>
                </div>
            </aside>

            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
            />

            {/* Main Content Area */}
            <main className="main-container">
                <header className="main-header">
                    <div className="header-search">
                        {/* Placeholder for search or context info */}
                    </div>
                    <div className="header-actions">
                        <div className="notification-bell" onClick={() => navigate('/patient/reminders')}>
                            <Bell size={20} />
                            {hasUpdate && <span className="notification-badge"></span>}
                        </div>
                        <div className="user-profile-header">
                            <div className="user-info">
                                <span className="user-name">{user?.name || 'Patient'}</span>
                                <span className="user-role">Patient ID: {user?.id}</span>
                            </div>
                            <div className="avatar-small">
                                <UserCircle size={32} />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="content-scroll">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="mobile-nav">
                {navItems.map((item) => (
                    <div
                        key={item.path}
                        className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </div>
                ))}
            </nav>
        </div>
    );
};

export default PatientLayout;
