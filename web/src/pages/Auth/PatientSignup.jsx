import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Lock, ChevronRight, UserPlus, Activity,
    Briefcase, Ruler, Weight, Phone, Calendar, Heart,
    ShieldAlert, Stethoscope, CheckCircle2, ArrowLeft, ShieldCheck
} from 'lucide-react';
import APIConfig from '../../config';

/* ── Reusable styled input ── */
const FInput = ({ icon: Icon, placeholder, value, onChange, type = 'text' }) => (
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
        {Icon && <Icon size={18} color="#8E8E93" style={{ marginRight: 12, flexShrink: 0 }} />}
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, fontWeight: 500, color: '#1C1C1E' }}
        />
    </div>
);

const FSelect = ({ icon: Icon, value, onChange, children }) => (
    <div style={{
        display: 'flex', alignItems: 'center',
        background: 'white', borderRadius: 14, padding: '0 16px',
        border: '1.5px solid #E5E5EA', height: 52,
    }}>
        {Icon && <Icon size={18} color="#8E8E93" style={{ marginRight: 12 }} />}
        <select value={value} onChange={e => onChange(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, fontWeight: 500, color: '#1C1C1E', appearance: 'none' }}>
            {children}
        </select>
    </div>
);

const STEPS = ['Personal Info', 'Medical Details', 'Set Password'];

const PatientSignup = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [createdId, setCreatedId] = useState('');

    const [form, setForm] = useState({
        name: '', age: '', gender: 'Male', height: '', weight: '',
        diagnosis: '', occupation: '', phone_number: '', password: '', confirmPassword: ''
    });

    const set = field => val => setForm(p => ({ ...p, [field]: val }));

    const handleNext = () => {
        setError('');
        if (step === 1 && (!form.name || !form.age || !form.occupation || !form.phone_number)) {
            setError('Please fill all personal information'); return;
        }
        if (step === 2 && (!form.height || !form.weight || !form.diagnosis)) {
            setError('Please fill all medical details'); return;
        }
        setStep(s => s + 1);
    };

    const handleSubmit = async () => {
        if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        setLoading(true); setError('');
        try {
            const res = await fetch(APIConfig.getURL('patient_signup.php'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name, age: form.age, gender: form.gender,
                    height: form.height, weight: form.weight, diagnosis: form.diagnosis,
                    occupation: form.occupation, phone_number: form.phone_number, password: form.password
                }),
            });
            const data = await res.json();
            if (data.status === 'success') { setCreatedId(data.patient_id); }
            else { setError(data.message || 'Registration failed'); }
        } catch { setError('Connection error. Is XAMPP running?'); }
        finally { setLoading(false); }
    };

    /* ── Success Screen ── */
    if (createdId) return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg,#4A3CE0,#9B7EFA)', fontFamily: "'Inter', sans-serif" }}>
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ background: 'white', borderRadius: 32, padding: '48px 40px', textAlign: 'center', maxWidth: 420, width: '90%', boxShadow: '0 40px 80px rgba(0,0,0,0.25)' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(52,199,89,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <CheckCircle2 size={44} color="#34C759" />
                </div>
                <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1C1C1E', margin: '0 0 8px' }}>Registration Successful!</h2>
                <p style={{ fontSize: 14, color: '#8E8E93', margin: '0 0 28px' }}>Welcome to BreathTrack. Save your Patient ID below.</p>
                <div style={{ background: '#F4F6FF', borderRadius: 18, padding: '20px', border: '2px dashed #5B4CF5', marginBottom: 28 }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 1.5, margin: '0 0 8px' }}>Your Patient ID</p>
                    <p style={{ fontSize: 28, fontWeight: 800, color: '#5B4CF5', margin: 0, letterSpacing: 2 }}>{createdId}</p>
                </div>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/login')}
                    style={{ width: '100%', height: 52, borderRadius: 16, border: 'none', background: 'linear-gradient(135deg,#5B4CF5,#857AF7)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 24px rgba(91,76,245,0.3)' }}>
                    Continue to Login
                </motion.button>
            </motion.div>
        </div>
    );

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', background: '#F4F6FF', fontFamily: "'Inter', -apple-system, sans-serif" }}>

            {/* ── LEFT PANEL ── */}
            <div className="signup-hero-panel" style={{
                width: '40%', minWidth: 320,
                background: 'linear-gradient(145deg,#4A3CE0 0%,#6B52F5 45%,#9B7EFA 100%)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '48px 36px', position: 'relative', overflow: 'hidden',
            }}>
                {/* Hex pattern */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 }}>
                    <defs>
                        <pattern id="hex3" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
                            <polygon points="28,2 54,15 54,41 28,54 2,41 2,15" fill="none" stroke="white" strokeWidth="1.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#hex3)" />
                </svg>
                <div style={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

                <div style={{ textAlign: 'center', zIndex: 1 }}>
                    <div style={{ width: 72, height: 72, borderRadius: 22, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1.5px solid rgba(255,255,255,0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                        <UserPlus size={34} color="white" strokeWidth={2.5} />
                    </div>
                    <h2 style={{ color: 'white', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Create Account</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: '0 0 32px', lineHeight: 1.6 }}>Join the BreathTrack<br />respiratory care community</p>

                    {/* Step Progress */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
                        {STEPS.map((label, i) => {
                            const num = i + 1;
                            const done = num < step;
                            const active = num === step;
                            return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <div style={{
                                        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: done ? '#34C759' : active ? 'white' : 'rgba(255,255,255,0.15)',
                                        color: done ? 'white' : active ? '#5B4CF5' : 'rgba(255,255,255,0.5)',
                                        fontWeight: 800, fontSize: 14,
                                        boxShadow: active ? '0 4px 14px rgba(255,255,255,0.3)' : 'none',
                                        transition: 'all 0.3s',
                                    }}>
                                        {done ? <CheckCircle2 size={18} /> : num}
                                    </div>
                                    <span style={{ color: active ? 'white' : done ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)', fontWeight: active ? 700 : 500, fontSize: 14, transition: 'all 0.3s' }}>
                                        {label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <img src="/illustration.png" alt="" style={{ width: '85%', maxWidth: 300, marginTop: 40, filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.3))', zIndex: 1 }} onError={e => { e.target.style.display = 'none'; }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 32, zIndex: 1 }}>
                    <ShieldCheck size={13} color="rgba(255,255,255,0.5)" />
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600 }}>Your health data is secure with us.</span>
                </div>
            </div>

            {/* ── RIGHT PANEL (Form) ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', overflowY: 'auto' }}>
                <div style={{ width: '100%', maxWidth: 420 }}>

                    {/* Back + Step */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                        <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/login')}
                            style={{ width: 40, height: 40, borderRadius: 12, border: '1.5px solid #E5E5EA', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <ArrowLeft size={18} color="#3A3A3C" />
                        </button>
                        <div>
                            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1C1C1E' }}>{STEPS[step - 1]}</p>
                            <p style={{ margin: 0, fontSize: 12, color: '#8E8E93', fontWeight: 600 }}>Step {step} of 3</p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ height: 4, background: '#F2F2F7', borderRadius: 4, marginBottom: 28, overflow: 'hidden' }}>
                        <motion.div animate={{ width: `${(step / 3) * 100}%` }} transition={{ duration: 0.4 }}
                            style={{ height: '100%', background: 'linear-gradient(90deg,#5B4CF5,#857AF7)', borderRadius: 4 }} />
                    </div>

                    {error && (
                        <div style={{ background: '#FEE2E2', color: '#EF4444', borderRadius: 12, padding: '10px 14px', fontSize: 13, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />{error}
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <FInput icon={User} placeholder="Full Name" value={form.name} onChange={set('name')} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <FInput icon={Calendar} placeholder="Age" value={form.age} onChange={set('age')} type="number" />
                                    <FSelect icon={Heart} value={form.gender} onChange={set('gender')}>
                                        <option>Male</option><option>Female</option><option>Other</option>
                                    </FSelect>
                                </div>
                                <FInput icon={Briefcase} placeholder="Occupation" value={form.occupation} onChange={set('occupation')} />
                                <FInput icon={Phone} placeholder="Phone Number" value={form.phone_number} onChange={set('phone_number')} type="tel" />
                            </motion.div>
                        )}
                        {step === 2 && (
                            <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <FInput icon={Ruler} placeholder="Height (cm)" value={form.height} onChange={set('height')} type="number" />
                                    <FInput icon={Weight} placeholder="Weight (kg)" value={form.weight} onChange={set('weight')} type="number" />
                                </div>
                                <FInput icon={Stethoscope} placeholder="Initial Diagnosis / Condition" value={form.diagnosis} onChange={set('diagnosis')} />
                                <p style={{ fontSize: 12, color: '#8E8E93', margin: '4px 0 0', lineHeight: 1.5, fontStyle: 'italic' }}>
                                    This helps your doctor provide an accurate care plan.
                                </p>
                            </motion.div>
                        )}
                        {step === 3 && (
                            <motion.div key="s3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <FInput icon={Lock} placeholder="Password (min. 6 characters)" value={form.password} onChange={set('password')} type="password" />
                                <FInput icon={ShieldAlert} placeholder="Confirm Password" value={form.confirmPassword} onChange={set('confirmPassword')} type="password" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Action Button */}
                    <motion.button whileTap={{ scale: 0.97 }} disabled={loading}
                        onClick={step < 3 ? handleNext : handleSubmit}
                        style={{
                            width: '100%', height: 54, borderRadius: 16, border: 'none', marginTop: 24,
                            background: 'linear-gradient(135deg,#5B4CF5,#857AF7)',
                            color: 'white', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            boxShadow: '0 10px 24px rgba(91,76,245,0.28)', opacity: loading ? 0.8 : 1,
                        }}>
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ width: 20, height: 20, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                                Creating account...
                            </span>
                        ) : step < 3 ? <><span>Continue</span><ChevronRight size={18} /></> : <><UserPlus size={18} /><span>Complete Registration</span></>}
                    </motion.button>

                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <span style={{ fontSize: 13, color: '#8E8E93' }}>Already have an account? </span>
                        <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#5B4CF5', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                            Sign In
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .signup-hero-panel { display: flex; }
                @media (max-width: 640px) { .signup-hero-panel { display: none !important; } }
            `}</style>
        </div>
    );
};

export default PatientSignup;
