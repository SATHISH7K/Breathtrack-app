import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Stethoscope, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BTInputField from '../../components/BTInputField';
import BTPrimaryButton from '../../components/BTPrimaryButton';
import './Login.css';

const DoctorLogin: React.FC = () => {
    const [doctorId, setDoctorId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login({
            id: doctorId,
            password,
            role: 'doctor'
        });

        if (result.success) {
            navigate('/doctor/dashboard');
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="doctor-login-page">
            <div className="doctor-portal-bg">
                <div className="doctor-dot-pattern"></div>
            </div>

            <motion.div
                className="doctor-login-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="doctor-card-header">
                    <div className="doctor-badge-ios">
                        <Stethoscope size={14} />
                        <span>Doctor Portal</span>
                    </div>
                </div>

                <div className="doctor-login-content">
                    <div className="doctor-titles">
                        <Link to="/select-role" className="back-link-web" style={{ marginBottom: '16px', color: '#7B6CF6' }}>
                            <ChevronLeft size={16} /> Back to Selection
                        </Link>
                        <h1>Doctor Sign In</h1>
                        <p>Access patient records and appointments</p>
                    </div>

                    <form onSubmit={handleLogin} className="doctor-form">
                        <BTInputField
                            icon={<User size={20} />}
                            placeholder="Doctor ID"
                            value={doctorId}
                            onChange={(e) => setDoctorId(e.target.value)}
                        />

                        <BTInputField
                            icon={<Lock size={20} />}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-12px' }}>
                            <Link to="/doctor/forgot-password" style={{ color: '#7B6CF6', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>
                                Forgot Password?
                            </Link>
                        </div>

                        {error && (
                            <motion.div
                                className="doctor-login-error"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <BTPrimaryButton
                            type="submit"
                            variant="purple"
                            loading={loading}
                            fullWidth
                            className="doctor-signin-btn"
                        >
                            Sign In
                        </BTPrimaryButton>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default DoctorLogin;
