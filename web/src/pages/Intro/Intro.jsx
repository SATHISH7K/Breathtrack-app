import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ChevronRight, Wind, BarChart3, ClipboardList, Heart, ShieldCheck } from 'lucide-react';

const features = [
    {
        icon: Wind,
        color: '#5B4CF5',
        bg: 'rgba(91,76,245,0.1)',
        title: 'Lung Monitoring',
        desc: 'Real-time SpO₂, PEF & temperature tracking',
    },
    {
        icon: BarChart3,
        color: '#34C759',
        bg: 'rgba(52,199,89,0.1)',
        title: 'Risk Prediction',
        desc: 'AI-assisted CAT questionnaire analysis',
    },
    {
        icon: ClipboardList,
        color: '#FF9500',
        bg: 'rgba(255,149,0,0.1)',
        title: 'Treatment Tracking',
        desc: 'Medication diary & doctor reports in one place',
    },
    {
        icon: Heart,
        color: '#FF3B30',
        bg: 'rgba(255,59,48,0.1)',
        title: 'Better Care',
        desc: 'Personalised advice from your care team',
    },
];

const Intro = () => {
    const navigate = useNavigate();
    const [appeared, setAppeared] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setAppeared(true), 80);
        return () => clearTimeout(t);
    }, []);

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: '#F4F6FF',
            display: 'flex',
            fontFamily: "'Inter', -apple-system, sans-serif",
        }}>

            {/* ═══════════════════════════════════
                LEFT — Hero / Brand Panel
            ═══════════════════════════════════ */}
            <motion.div
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                    width: '45%', minWidth: 340,
                    background: 'linear-gradient(145deg,#4A3CE0 0%,#6B52F5 45%,#9B7EFA 100%)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'space-between',
                    padding: '56px 40px 44px',
                    position: 'relative', overflow: 'hidden',
                }}
                className="intro-hero-panel"
            >
                {/* Hex Background */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 }}>
                    <defs>
                        <pattern id="hex2" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
                            <polygon points="28,2 54,15 54,41 28,54 2,41 2,15" fill="none" stroke="white" strokeWidth="1.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#hex2)" />
                </svg>

                {/* Glowing orbs */}
                <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ position: 'absolute', bottom: 60, left: -100, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

                {/* Logo */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                    style={{ textAlign: 'center', zIndex: 1 }}
                >
                    <div style={{
                        width: 80, height: 80, borderRadius: 24,
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 22px',
                        border: '1.5px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
                    }}>
                        <Activity size={40} color="white" strokeWidth={2.5} />
                    </div>
                    <h1 style={{ color: 'white', fontSize: 36, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
                        BreathTrack
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, fontWeight: 600, margin: '0 0 6px' }}>
                        Monitor. Breathe. Recover.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <div style={{ height: 1.5, width: 32, background: 'rgba(255,255,255,0.35)', borderRadius: 2 }} />
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>❤</span>
                        <div style={{ height: 1.5, width: 32, background: 'rgba(255,255,255,0.35)', borderRadius: 2 }} />
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: '12px 0 0', lineHeight: 1.6 }}>
                        Smart COPD Management<br />for a Better Tomorrow
                    </p>
                </motion.div>

                {/* Illustration */}
                <motion.div
                    initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    style={{ zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                    <img
                        src="/illustration.png"
                        alt="BreathTrack"
                        style={{
                            width: '92%', maxWidth: 400,
                            filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.35))',
                        }}
                        onError={e => { e.target.style.display = 'none'; }}
                    />
                </motion.div>

                {/* Trust badge */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, zIndex: 1 }}
                >
                    <ShieldCheck size={14} color="rgba(255,255,255,0.55)" />
                    <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 600 }}>
                        Your health data is secure with us.
                    </span>
                </motion.div>
            </motion.div>

            {/* ═══════════════════════════════════
                RIGHT — Content / CTA Panel
            ═══════════════════════════════════ */}
            <motion.div
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: '40px 32px', overflowY: 'auto',
                }}
            >
                <div style={{ width: '100%', maxWidth: 440 }}>

                    {/* Heading */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                        style={{ marginBottom: 40 }}
                    >
                        <span style={{
                            display: 'inline-block',
                            background: 'rgba(91,76,245,0.1)',
                            color: '#5B4CF5', fontSize: 11, fontWeight: 800,
                            textTransform: 'uppercase', letterSpacing: 1.5,
                            padding: '6px 14px', borderRadius: 100, marginBottom: 16,
                        }}>
                            Respiratory Care Platform
                        </span>
                        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1C1C1E', margin: '0 0 12px', lineHeight: 1.25, letterSpacing: '-0.3px' }}>
                            Precision care for<br />
                            <span style={{ background: 'linear-gradient(135deg,#5B4CF5,#857AF7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                every breath
                            </span>
                        </h2>
                        <p style={{ fontSize: 15, color: '#8E8E93', lineHeight: 1.65, margin: 0 }}>
                            Track, manage, and consult with respiratory specialists — all in one secure platform trusted by clinicians worldwide.
                        </p>
                    </motion.div>

                    {/* Feature Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 40 }}>
                        {features.map(({ icon: Icon, color, bg, title, desc }, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 + i * 0.08 }}
                                style={{
                                    background: 'white', borderRadius: 20, padding: '18px 16px',
                                    border: '1.5px solid #F0F0F5',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                }}
                            >
                                <div style={{
                                    width: 40, height: 40, borderRadius: 12,
                                    background: bg, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    marginBottom: 12,
                                }}>
                                    <Icon size={20} color={color} />
                                </div>
                                <p style={{ fontWeight: 700, fontSize: 13, color: '#1C1C1E', margin: '0 0 4px' }}>{title}</p>
                                <p style={{ fontSize: 11, color: '#8E8E93', margin: 0, lineHeight: 1.5 }}>{desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.75 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                    >
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/login')}
                            style={{
                                width: '100%', height: 56, borderRadius: 18, border: 'none',
                                background: 'linear-gradient(135deg,#5B4CF5,#857AF7)',
                                color: 'white', fontSize: 16, fontWeight: 700,
                                cursor: 'pointer', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: 10,
                                boxShadow: '0 12px 28px rgba(91,76,245,0.3)',
                            }}
                        >
                            Get Started <ChevronRight size={20} />
                        </motion.button>

                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/signup')}
                            style={{
                                width: '100%', height: 52, borderRadius: 18,
                                border: '1.5px solid #E5E5EA',
                                background: 'white', color: '#3A3A3C',
                                fontSize: 15, fontWeight: 700, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            }}
                        >
                            Create Patient Account
                        </motion.button>
                    </motion.div>

                    {/* Footer */}
                    <p style={{ textAlign: 'center', fontSize: 11, color: '#C7C7CC', marginTop: 28, fontWeight: 500 }}>
                        © 2026 BreathTrack. All rights reserved.
                    </p>
                </div>
            </motion.div>

            <style>{`
                .intro-hero-panel { display: flex; }
                @media (max-width: 640px) {
                    .intro-hero-panel { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default Intro;
