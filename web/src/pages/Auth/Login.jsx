import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Lock, ArrowRight, Activity, ShieldCheck,
    Stethoscope, Eye, EyeOff, Wind,
    BarChart3, ClipboardList, Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import APIConfig from '../../config';

const patientFeatures = [
    { icon: Wind, label: 'Lung\nMonitoring' },
    { icon: BarChart3, label: 'Risk\nPrediction' },
    { icon: ClipboardList, label: 'Treatment\nTracking' },
    { icon: Heart, label: 'Better\nCare' },
];

/* Reusable input row */
const FormInput = ({ icon: Icon, placeholder, value, onChange, type = 'text', rightEl }) => (
    <div
        style={{
            display: 'flex', alignItems: 'center',
            background: 'white', borderRadius: 14, padding: '0 16px',
            border: '1.5px solid #E5E5EA', height: 52,
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = '#5B4CF5'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(91,76,245,0.09)'; }}
        onBlur={e => { e.currentTarget.style.borderColor = '#E5E5EA'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)'; }}
    >
        <Icon size={18} color="#8E8E93" style={{ marginRight: 12, flexShrink: 0 }} />
        <input
            type={type} placeholder={placeholder} value={value} onChange={onChange}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, fontWeight: 500, color: '#1C1C1E' }}
        />
        {rightEl}
    </div>
);

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [role, setRole] = useState('patient');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isDoctor = role === 'doctor';

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!id || !password) { setError('Please fill in all fields'); return; }
        setLoading(true); setError('');
        try {
            const endpoint = isDoctor ? 'doctor_login.php' : 'patient_login.php';
            const payload = isDoctor ? { doctor_id: id, password } : { patient_id: id, password };

            const res = await fetch(APIConfig.getURL(endpoint), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (data.status === 'success') {
                const userObj = isDoctor
                    ? { username: data.username || id, name: data.name || 'Doctor' }
                    : { patient_id: data.patient_id, name: data.name };
                login(userObj, role);
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch {
            setError('Server connection failed. Is XAMPP running?');
        } finally {
            setLoading(false);
        }
    };

    /* Switch role and reset fields */
    const switchRole = (r) => { setRole(r); setId(''); setPassword(''); setError(''); };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', background: '#F4F6FF',
            fontFamily: "'Inter', -apple-system, sans-serif",
        }}>

            {/* ═══════════════════════════════════════════
                LEFT PANEL — switches based on role
            ═══════════════════════════════════════════ */}
            <AnimatePresence mode="wait">
                {!isDoctor ? (
                    /* ── PATIENT left panel ── */
                    <motion.div key="patient-panel"
                        initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="login-hero-panel"
                        style={{
                            width: '45%', minWidth: 340,
                            background: 'linear-gradient(145deg,#4A3CE0 0%,#6B52F5 45%,#9B7EFA 100%)',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'space-between',
                            padding: '48px 40px 36px',
                            position: 'relative', overflow: 'hidden',
                        }}
                    >
                        {/* Hex pattern */}
                        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 }}>
                            <defs>
                                <pattern id="hexP" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
                                    <polygon points="28,2 54,15 54,41 28,54 2,41 2,15" fill="none" stroke="white" strokeWidth="1.5" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#hexP)" />
                        </svg>
                        <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                        <div style={{ position: 'absolute', bottom: 80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

                        {/* Logo */}
                        <div style={{ textAlign: 'center', zIndex: 1 }}>
                            <div style={{ width: 72, height: 72, borderRadius: 22, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1.5px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                                <Activity size={36} color="white" strokeWidth={2.5} />
                            </div>
                            <h1 style={{ color: 'white', fontSize: 32, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>BreathTrack</h1>
                            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, fontWeight: 600, margin: '0 0 4px' }}>Monitor. Breathe. Recover.</p>
                            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 10, lineHeight: 1.6 }}>
                                Smart COPD Management<br />for a Better Tomorrow
                            </p>
                        </div>

                        {/* Illustration */}
                        <img src="/illustration.png" alt="BreathTrack"
                            style={{ width: '90%', maxWidth: 380, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))', zIndex: 1 }}
                            onError={e => { e.target.style.display = 'none'; }} />

                        {/* Features row */}
                        <div style={{ display: 'flex', gap: 8, zIndex: 1, width: '100%', justifyContent: 'center' }}>
                            {patientFeatures.map(({ icon: Icon, label }, i) => (
                                <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderRadius: 16, padding: '12px 8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
                                    <Icon size={22} color="white" style={{ margin: '0 auto 6px' }} />
                                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: 700, margin: 0, whiteSpace: 'pre-line', lineHeight: 1.4 }}>{label}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, zIndex: 1, marginTop: 8 }}>
                            <ShieldCheck size={14} color="rgba(255,255,255,0.6)" />
                            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 600 }}>Your health data is secure with us.</span>
                        </div>
                    </motion.div>
                ) : (
                    /* ── DOCTOR left panel — matches iOS doctorlogin.swift ── */
                    <motion.div key="doctor-panel"
                        initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="login-hero-panel"
                        style={{
                            width: '45%', minWidth: 340,
                            background: 'linear-gradient(145deg,#1a1060 0%,#2d1b8e 40%,#4A3CE0 75%,#6B52F5 100%)',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'space-between',
                            padding: '56px 40px 44px',
                            position: 'relative', overflow: 'hidden',
                        }}
                    >
                        {/* Dot grid pattern */}
                        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }}>
                            <defs>
                                <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
                                    <circle cx="12" cy="12" r="1.5" fill="white" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#dots)" />
                        </svg>
                        {/* Glowing ellipse top (mirrors iOS GeometryReader ellipse) */}
                        <div style={{ position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)', width: '160%', height: 300, borderRadius: '50%', background: 'rgba(155,126,250,0.18)', pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', bottom: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(91,76,245,0.15)' }} />

                        {/* Tag pill — mirrors BTPillTag "Doctor" */}
                        <div style={{ alignSelf: 'flex-end', zIndex: 1 }}>
                            <span style={{ background: 'rgba(155,126,250,0.25)', color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.2)', letterSpacing: 0.5 }}>
                                Doctor
                            </span>
                        </div>

                        {/* Hero stethoscope illustration — mirrors iOS ZStack circles + stethoscope icon */}
                        <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
                            {/* Circle rings + stethoscope */}
                            <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(155,126,250,0.08)' }} />
                                <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: 'rgba(155,126,250,0.12)' }} />
                                <img src="/doctor_illustration.jpg" alt="Doctor"
                                    style={{ width: 180, height: 180, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top center', border: '3px solid rgba(255,255,255,0.2)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)', position: 'relative', zIndex: 1 }}
                                    onError={e => {
                                        // fallback to stethoscope icon
                                        e.target.style.display = 'none';
                                        e.target.parentNode.querySelector('.fallback-icon').style.display = 'flex';
                                    }}
                                />
                                <div className="fallback-icon" style={{ display: 'none', position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                                    <Stethoscope size={80} color="rgba(255,255,255,0.9)" strokeWidth={1.2} />
                                </div>
                            </div>

                            {/* Title + subtitle — mirrors iOS header text */}
                            <div style={{ textAlign: 'center' }}>
                                <h1 style={{ color: 'white', fontSize: 30, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.3px' }}>Doctor Sign In</h1>
                                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                                    Access your patient<br />management portal
                                </p>
                            </div>
                        </div>

                        {/* Feature pills */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, zIndex: 1, width: '100%' }}>
                            {[
                                { label: 'Manage patient records & reports' },
                                { label: 'Submit PFT / ABG / clinical notes' },
                                { label: 'Upload educational resources' },
                            ].map((f, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#857AF7', flexShrink: 0 }} />
                                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 600 }}>{f.label}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, zIndex: 1 }}>
                            <ShieldCheck size={13} color="rgba(255,255,255,0.5)" />
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600 }}>Secure clinical portal</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════════
                RIGHT PANEL — Form
            ═══════════════════════════════════════════ */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', overflowY: 'auto', background: '#F4F6FF' }}>
                <div style={{ width: '100%', maxWidth: 420 }}>

                    {/* Role Switcher */}
                    <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
                        {[
                            { key: 'patient', icon: User, label: 'Patient', desc: 'View health records\nand track recovery' },
                            { key: 'doctor', icon: Stethoscope, label: 'Doctor', desc: 'Access patient records\nand manage treatment' },
                        ].map(({ key, icon: Icon, label, desc }) => (
                            <button key={key} onClick={() => switchRole(key)}
                                style={{
                                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                                    padding: '14px 12px', borderRadius: 18, cursor: 'pointer',
                                    border: role === key ? '2px solid #5B4CF5' : '1.5px solid #E5E5EA',
                                    background: role === key ? 'rgba(91,76,245,0.06)' : 'white',
                                    transition: 'all 0.2s',
                                    boxShadow: role === key ? '0 4px 16px rgba(91,76,245,0.12)' : '0 2px 8px rgba(0,0,0,0.03)',
                                }}>
                                <div style={{ width: 42, height: 42, borderRadius: 13, background: role === key ? 'linear-gradient(135deg,#5B4CF5,#857AF7)' : '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: role === key ? '0 4px 12px rgba(91,76,245,0.3)' : 'none', transition: 'all 0.2s' }}>
                                    <Icon size={20} color={role === key ? 'white' : '#8E8E93'} />
                                </div>
                                <span style={{ fontWeight: 700, fontSize: 13, color: role === key ? '#5B4CF5' : '#3A3A3C' }}>{label}</span>
                                <span style={{ fontSize: 10, color: '#8E8E93', textAlign: 'center', lineHeight: 1.4, fontWeight: 500, whiteSpace: 'pre-line' }}>{desc}</span>
                            </button>
                        ))}
                    </div>

                    {/* Heading — changes per role */}
                    <AnimatePresence mode="wait">
                        <motion.div key={role} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} style={{ marginBottom: 24 }}>
                            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1C1C1E', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
                                {isDoctor ? 'Doctor Sign In' : 'Welcome back 👋'}
                            </h2>
                            <p style={{ fontSize: 14, color: '#8E8E93', margin: 0 }}>
                                {isDoctor
                                    ? 'Sign in to your patient management portal'
                                    : 'Sign in to continue to BreathTrack'}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <FormInput
                            icon={isDoctor ? Stethoscope : User}
                            placeholder={isDoctor ? 'Doctor ID' : 'Patient ID (e.g. pat_123)'}
                            value={id} onChange={e => setId(e.target.value)}
                        />
                        <FormInput
                            icon={Lock} placeholder="Password"
                            value={password} onChange={e => setPassword(e.target.value)}
                            type={showPw ? 'text' : 'password'}
                            rightEl={
                                <button type="button" onClick={() => setShowPw(v => !v)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8E8E93', display: 'flex', padding: 4 }}>
                                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            }
                        />

                        {/* Forgot Password */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => navigate('/forgot-password')}
                                style={{ background: 'none', border: 'none', color: '#5B4CF5', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                                Forgot Password?
                            </button>
                        </div>

                        {error && (
                            <div style={{ background: '#FEE2E2', color: '#EF4444', borderRadius: 12, padding: '10px 14px', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />{error}
                            </div>
                        )}

                        {/* Submit */}
                        <motion.button type="submit" whileTap={{ scale: 0.97 }} disabled={loading}
                            style={{
                                width: '100%', height: 54, borderRadius: 16, border: 'none', marginTop: 4,
                                background: 'linear-gradient(135deg,#5B4CF5,#857AF7)',
                                color: 'white', fontSize: 16, fontWeight: 700,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                boxShadow: '0 10px 24px rgba(91,76,245,0.3)',
                                opacity: loading ? 0.8 : 1,
                            }}>
                            {loading
                                ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ width: 20, height: 20, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                                    Signing in...
                                </span>
                                : <>{isDoctor ? 'Sign In to Portal' : 'Sign In'} <ArrowRight size={18} /></>
                            }
                        </motion.button>

                        {!isDoctor && (
                            <div style={{ textAlign: 'center', marginTop: 4 }}>
                                <span style={{ fontSize: 13, color: '#8E8E93' }}>Don't have an account? </span>
                                <button type="button" onClick={() => navigate('/signup')}
                                    style={{ background: 'none', border: 'none', color: '#5B4CF5', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                                    Register
                                </button>
                            </div>
                        )}
                    </form>

                    {/* Footer */}
                    <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid #E5E5EA', textAlign: 'center' }}>
                        <p style={{ fontSize: 11, color: '#C7C7CC', margin: 0, fontWeight: 500 }}>© 2026 BreathTrack. All rights reserved.</p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .login-hero-panel { display: flex !important; }
                @media (max-width: 640px) { .login-hero-panel { display: none !important; } }
            `}</style>
        </div>
    );
};

export default Login;
