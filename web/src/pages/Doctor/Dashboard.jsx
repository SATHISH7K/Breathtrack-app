import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Calendar, Video, Bell, Menu, X, User, LogOut,
    ChevronRight, Clock, CheckCircle, Stethoscope, Search,
    Activity, ShieldCheck, Heart, LayoutGrid, FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DoctorDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [stats, setStats] = useState({ patients: 0, appointments: 0, reports: 0 });

    useEffect(() => {
        // Mock stats or fetch actual if available
        setStats({ patients: 124, appointments: 8, reports: 42 });
    }, []);

    return (
        <div className="page-container flex flex-col relative overflow-hidden bg-[#F0F2F9] min-h-screen">
            {/* ── Side Drawer Overlay ─────────────────────── */}
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
                            className="fixed top-0 left-0 bottom-0 w-[320px] bg-white z-[101] shadow-2xl flex flex-col"
                        >
                            <div className="p-8 flex flex-col h-full">
                                <div className="flex flex-col items-center mb-12 pt-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-linear-to-br from-[#1a1060] to-[#4A3CE0] rounded-[32px] flex items-center justify-center shadow-2xl text-white">
                                            <Stethoscope size={48} strokeWidth={1.5} />
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#34C759] rounded-full border-4 border-white flex items-center justify-center text-white">
                                            <ShieldCheck size={18} />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black mt-6 text-[#1C1C1E]">Dr. {user?.name || 'Consultant'}</h3>
                                    <p className="text-[12px] font-black text-[#8E8E93] uppercase tracking-[2px] mt-1">Medical Specialist</p>
                                </div>

                                <nav className="flex flex-col gap-3">
                                    <NavOption icon={LayoutGrid} label="Dashboard" active />
                                    <NavOption icon={Users} label="Patient List" onClick={() => navigate('/doctor/patients')} />
                                    <NavOption icon={Calendar} label="Appointments" onClick={() => navigate('/doctor/appointments')} />
                                    <NavOption icon={Video} label="Telehealth" onClick={() => navigate('/doctor/meetings')} />
                                </nav>

                                <div className="mt-auto flex flex-col gap-3">
                                    <div className="h-px bg-[#E5E5EA] w-full mb-4" />
                                    <NavOption icon={LogOut} label="Log Out" color="#FF3B30" onClick={logout} />
                                    <p className="text-center text-[#C7C7CC] text-[10px] font-bold uppercase tracking-widest mt-4">BreathTrack v1.5 Premium</p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── Main Header ────────────────────────────────── */}
            <header className="sticky top-0 z-50 bg-[#F0F2F9]/80 backdrop-blur-xl pt-14 pb-4 px-8 flex items-center justify-between">
                <button onClick={() => setShowMenu(true)} className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-[#E5E5EA] flex items-center justify-center text-[#1C1C1E] active:scale-90 transition-all">
                    <Menu size={22} />
                </button>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[13px] font-black text-[#1C1C1E] leading-none mb-1">Dr. {user?.name}</p>
                        <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-wider">HOSPITAL PORTAL</p>
                    </div>
                    <button className="w-12 h-12 bg-white rounded-full border-2 border-white shadow-lg overflow-hidden active:scale-95 transition-all">
                        <div className="w-full h-full bg-[#5B4CF5]/10 flex items-center justify-center text-[#5B4CF5]">
                            <User size={24} />
                        </div>
                    </button>
                </div>
            </header>

            {/* ── Scrollable Content ────────────────────────── */}
            <main className="flex-1 overflow-y-auto px-8 pt-6 pb-24">
                <div className="max-w-[1200px] mx-auto flex flex-col gap-10">

                    {/* Welcome Section */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-black text-[#1C1C1E] tracking-tight">Portal Overview</h1>
                        <p className="text-[#8E8E93] text-lg font-medium">Monitoring respiratory health across your patient base.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard icon={Users} label="Total Patients" value={stats.patients} color="#5B4CF5" />
                        <StatCard icon={Calendar} label="Today's Visits" value={stats.appointments} color="#FF9500" />
                        <StatCard icon={FileText} label="Pending Reports" value={stats.reports} color="#34C759" />
                    </div>

                    {/* Main Action Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Interactive Tiles */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-[12px] font-black text-[#8E8E93] uppercase tracking-[2px] mb-1">Clinic Management</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <PortalTile title="Search Patients" icon={Search} color="#5B4CF5" onClick={() => navigate('/doctor/patients')} />
                                <PortalTile title="Add New Record" icon={Activity} color="#FF2D55" onClick={() => navigate('/doctor/patients')} />
                                <PortalTile title="Manage Videos" icon={Video} color="#34C759" onClick={() => navigate('/doctor/manage-videos')} />
                                <PortalTile title="Settings" icon={ShieldCheck} color="#8E8E93" />
                            </div>
                        </div>

                        {/* Recent Activity Mini List */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-[12px] font-black text-[#8E8E93] uppercase tracking-[2px] mb-1">Recent Consultations</h3>
                            <div className="bg-white rounded-[32px] p-8 shadow-card border border-[#E5E5EA]/50 flex flex-col gap-6">
                                {[1, 2, 3].map(i => (
                                    <ActivityRow key={i} name={`Patient #${100 + i}`} time={`${i}h ago`} status={i % 2 === 0 ? 'Urgent' : 'Routine'} />
                                ))}
                                <button className="w-full py-4 text-[#5B4CF5] font-black text-sm bg-[#F2F2F7] rounded-2xl hover:bg-[#E5E5EA] transition-colors">
                                    View Analytics Logs
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Bottom Nav (Mobile) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-2xl border-t border-[#E5E5EA] sm:hidden flex justify-around py-4 px-6 z-40">
                <BottomTab icon={LayoutGrid} active />
                <BottomTab icon={Users} />
                <BottomTab icon={Calendar} />
                <BottomTab icon={Video} />
            </div>
        </div>
    );
};

const NavOption = ({ icon: Icon, label, color, onClick, active }) => (
    <button onClick={onClick} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${active ? 'bg-[#5B4CF5] text-white shadow-lg shadow-[#5B4CF5]/30' : 'text-[#3A3A3C] hover:bg-[#F2F2F7]'}`}>
        <Icon size={22} style={{ color: active ? 'white' : color }} />
        <span className="font-extrabold text-[15px]">{label}</span>
        {active && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
    </button>
);

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-[32px] p-8 shadow-card border border-[#E5E5EA]/50 flex items-center justify-between">
        <div className="flex flex-col gap-1">
            <span className="text-[13px] font-black text-[#8E8E93] uppercase tracking-wider">{label}</span>
            <span className="text-4xl font-black text-[#1C1C1E]">{value}</span>
        </div>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
            <Icon size={28} />
        </div>
    </div>
);

const PortalTile = ({ title, icon: Icon, color, onClick }) => (
    <button onClick={onClick} className="bg-white rounded-[28px] p-6 shadow-sm border border-[#E5E5EA]/50 flex flex-col gap-4 text-left hover:shadow-xl hover:border-[#5B4CF5]/20 active:scale-[0.97] transition-all group">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: `${color}15`, color }}>
            <Icon size={24} />
        </div>
        <p className="text-[15px] font-black text-[#1C1C1E] leading-tight">{title}</p>
    </button>
);

const ActivityRow = ({ name, time, status }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#F2F2F7] rounded-full flex items-center justify-center text-[#8E8E93]">
                <User size={18} />
            </div>
            <div>
                <p className="text-[15px] font-black text-[#1C1C1E]">{name}</p>
                <p className="text-[11px] font-bold text-[#C7C7CC] uppercase tracking-wider">{time}</p>
            </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${status === 'Urgent' ? 'bg-[#FF3B30]/10 text-[#FF3B30]' : 'bg-[#34C759]/10 text-[#34C759]'}`}>
            {status}
        </span>
    </div>
);

const BottomTab = ({ icon: Icon, active }) => (
    <button className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${active ? 'text-[#5B4CF5]' : 'text-[#C7C7CC]'}`}>
        <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    </button>
);

export default DoctorDashboard;
