import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, ClipboardList, Stethoscope, Calendar,
    Pill, ShieldPlus, ChevronRight, Menu, Bell,
    LogOut, User, LayoutDashboard, Heart, Gauge,
    Sun, SunDim, Sunset, MoonStar, Wind, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PatientDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [greeting, setGreeting] = useState('');
    const [greetingIcon, setGreetingIcon] = useState(Sun);
    const [healthScore, setHealthScore] = useState(85);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting('Good Morning,');
            setGreetingIcon(SunDim);
        } else if (hour < 17) {
            setGreeting('Good Afternoon,');
            setGreetingIcon(Sun);
        } else if (hour < 21) {
            setGreeting('Good Evening,');
            setGreetingIcon(Sunset);
        } else {
            setGreeting('Good Night,');
            setGreetingIcon(MoonStar);
        }
    }, []);

    const firstName = user?.name?.split(' ')[0] || 'Patient';

    return (
        <div className="page-container flex flex-col relative overflow-hidden bg-[#F8F9FE] min-h-screen pb-24">
            {/* ── Side Menu Drawer ─────────────────────── */}
            <AnimatePresence>
                {showMenu && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowMenu(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
                        />
                        <motion.div
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[300px] bg-white z-[101] shadow-2xl flex flex-col"
                        >
                            <div className="p-8 flex flex-col h-full">
                                <div className="flex flex-col items-center mb-10 pt-6">
                                    <div className="w-24 h-24 bg-linear-to-br from-[#5B4CF5] to-[#857AF7] rounded-[32px] flex items-center justify-center text-white text-3xl font-black shadow-2xl">
                                        {firstName[0]}
                                    </div>
                                    <h3 className="text-2xl font-black mt-6 text-[#1C1C1E]">{user?.name}</h3>
                                    <p className="text-[11px] font-black text-[#8E8E93] uppercase tracking-[2px] mt-1">Patient ID: {user?.patient_id}</p>
                                </div>

                                <div className="h-px bg-[#E5E5EA] w-full mb-8" />

                                <div className="flex flex-col gap-3">
                                    <DrawerOption icon={User} label="Health Profile" onClick={() => navigate('/patient/profile')} />
                                    <DrawerOption icon={Activity} label="Vitals History" onClick={() => navigate('/patient/analysis')} />
                                    <DrawerOption icon={ShieldPlus} label="Privacy & Security" />
                                    <div className="h-px bg-[#E5E5EA] w-full my-4" />
                                    <DrawerOption icon={LogOut} label="Sign Out" color="#FF3B30" onClick={logout} />
                                </div>
                                <div className="mt-auto text-center text-[#C7C7CC] text-[10px] font-bold uppercase tracking-widest pb-6">
                                    BreathTrack AI Cloud
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── Premium Hero Header ────────────────────────── */}
            <div className="relative pt-16 pb-20 px-8 bg-linear-to-br from-[#4A3CE0] via-[#5B4CF5] to-[#857AF7] rounded-b-[60px] shadow-2xl overflow-hidden">
                {/* Decorative gradients */}
                <div className="absolute top-[-50px] right-[-50px] w-[300px] h-[300px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-50px] left-[-100px] w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[120px] pointer-events-none" />

                <div className="flex items-center justify-between mb-10 relative z-10">
                    <button onClick={() => setShowMenu(true)} className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 active:scale-95 transition-all shadow-inner">
                        <Menu size={22} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 relative">
                            <Bell size={22} />
                            <div className="absolute top-3 right-3 w-2 h-2 bg-[#FF3B30] rounded-full ring-2 ring-[#5B4CF5]" />
                        </div>
                        <div className="w-14 h-14 rounded-full border-2 border-white/30 p-0.5 shadow-2xl">
                            <div className="w-full h-full rounded-full bg-linear-to-br from-white/40 to-white/10 backdrop-blur-md flex items-center justify-center text-white text-xl font-bold">
                                {firstName[0]}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="text-white/70 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-2">
                            {React.createElement(greetingIcon, { size: 14, strokeWidth: 3 })}
                            <span className="text-[11px] font-black uppercase tracking-wider">{greeting}</span>
                        </div>
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
                        How is your<br /><span className="text-white/60">breathing today?</span>
                    </h2>
                </div>
            </div>

            {/* ── Main Dashboard ── */}
            <main className="px-8 -mt-12 relative z-20 flex flex-col gap-10">

                {/* Daily Vital Ring Tile */}
                <div className="bg-white rounded-[40px] p-8 shadow-card flex items-center gap-8 border border-[#E5E5EA]/40">
                    <div className="relative w-24 h-24">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="48" cy="48" r="40" fill="transparent" stroke="#F2F2F7" strokeWidth="10" />
                            <motion.circle
                                cx="48" cy="48" r="40" fill="transparent" stroke="#5B4CF5" strokeWidth="10"
                                strokeDasharray={2 * Math.PI * 40}
                                initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - healthScore / 100) }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-[#1C1C1E] leading-none mb-0.5">{healthScore}%</span>
                            <span className="text-[8px] font-black text-[#8E8E93] uppercase">Score</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} className="text-[#5B4CF5]" />
                            <h3 className="text-lg font-black text-[#1C1C1E]">Optimal State</h3>
                        </div>
                        <p className="text-[13px] font-medium text-[#8E8E93] leading-snug">Everything looks stable. Keep up with your inhaler routine.</p>
                    </div>
                </div>

                {/* Tracking Tasks Section */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-[13px] font-black text-[#8E8E93] uppercase tracking-[2px]">Daily Checkups</h3>
                        <button className="text-[11px] font-black text-[#5B4CF5] uppercase">Show Logs</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <TaskTile title="Oxygen Check" icon={Gauge} color="#5B4CF5" onClick={() => navigate('/patient/oxygen')} />
                        <TaskTile title="Temperature" icon={Heart} color="#FF2D55" onClick={() => navigate('/patient/checkup')} />
                        <TaskTile title="Lung Function" icon={Wind} color="#34C759" onClick={() => navigate('/patient/lung-check')} />
                        <TaskTile title="Daily Dose" icon={Pill} color="#FF9500" onClick={() => navigate('/patient/medication')} />
                    </div>
                </div>

                {/* Primary Action Card */}
                <button
                    onClick={() => navigate('/patient/advice')}
                    className="group bg-linear-to-r from-[#1C1C1E] to-[#3A3A3C] rounded-[40px] p-8 text-left relative overflow-hidden active:scale-[0.98] transition-all shadow-2xl"
                >
                    <div className="absolute bottom-[-20px] right-[-20px] w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
                    <div className="relative z-10 flex flex-col gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                            <Stethoscope size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-extrabold text-white mb-1">Clinical Advice</h3>
                            <p className="text-[13px] text-white/60 font-medium leading-relaxed max-w-[200px]">Review doctor's remarks and diagnostic reports.</p>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-white font-black text-[11px] uppercase tracking-widest">
                            View Care Plan <ChevronRight size={14} strokeWidth={3} />
                        </div>
                    </div>
                </button>

                {/* CAT Questionnaire Prompt */}
                <div className="flex flex-col gap-4 pb-12">
                    <h3 className="text-[13px] font-black text-[#8E8E93] uppercase tracking-[2px] px-2">Quick Assessment</h3>
                    <div
                        onClick={() => navigate('/patient/questions')}
                        className="bg-white rounded-[32px] p-6 shadow-card border border-[#E5E5EA]/40 flex items-center justify-between group cursor-pointer active:scale-[0.99] transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-[#5B4CF5]/5 rounded-2xl flex items-center justify-center text-[#5B4CF5]">
                                <ClipboardList size={28} />
                            </div>
                            <div>
                                <p className="text-[17px] font-extrabold text-[#1C1C1E]">CAT Symptom Score</p>
                                <p className="text-[12px] text-[#8E8E93] font-bold">Recommended every 24 hours</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#C7C7CC] group-hover:bg-[#5B4CF5]/10 group-hover:text-[#5B4CF5] transition-all">
                            <ChevronRight size={20} />
                        </div>
                    </div>
                </div>

            </main>

            {/* Bottom Floating Nav Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-8 z-[50] pointer-events-none">
                <div className="max-w-[400px] mx-auto bg-white/90 backdrop-blur-2xl rounded-full h-18 shadow-2xl border border-white flex items-center justify-around px-8 pointer-events-auto">
                    <BottomTab icon={LayoutDashboard} active />
                    <BottomTab icon={Wind} onClick={() => navigate('/patient/lung-check')} />
                    <BottomTab icon={Heart} onClick={() => navigate('/patient/checkup')} />
                    <BottomTab icon={User} onClick={() => navigate('/patient/profile')} />
                </div>
            </div>
        </div>
    );
};

const DrawerOption = ({ icon: Icon, label, color, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-[#F2F2F7] transition-all text-left">
        <Icon size={20} style={{ color: color || '#8E8E93' }} />
        <span className="font-extrabold text-[15px] text-[#3A3A3C]">{label}</span>
        <ChevronRight size={14} className="ml-auto text-[#C7C7CC]" />
    </button>
);

const TaskTile = ({ title, icon: Icon, color, onClick }) => (
    <button onClick={onClick} className="bg-white rounded-[32px] p-6 shadow-sm border border-[#E5E5EA]/40 flex flex-col gap-5 text-left active:scale-[0.97] transition-all hover:shadow-lg group">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: `${color}15`, color }}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-[11px] font-black text-[#8E8E93] uppercase tracking-wider mb-0.5">Record</p>
            <p className="text-[15px] font-black text-[#1C1C1E] leading-tight">{title}</p>
        </div>
    </button>
);

const BottomTab = ({ icon: Icon, active, onClick }) => (
    <button onClick={onClick} className={`w-12 h-12 flex items-center justify-center transition-all ${active ? 'text-[#5B4CF5]' : 'text-[#C7C7CC]'}`}>
        <Icon size={24} strokeWidth={active ? 3 : 2} />
    </button>
);

export default PatientDashboard;
