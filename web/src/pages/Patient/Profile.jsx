import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Ruler, Weight, Activity, LogOut, ChevronRight, Briefcase, Calendar } from 'lucide-react';
import { BTBackButton, BTCard, BTPrimaryButton } from '../../components/BTComponents';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    return (
        <div className="page-container flex flex-col pb-12">
            <div className="page-header justify-between">
                <BTBackButton onClick={() => navigate('/patient')} />
                <h1 className="page-title">My Profile</h1>
                <div className="w-11" />
            </div>

            <div className="page-content">
                {/* Profile Card */}
                <div className="flex flex-col items-center mt-6 mb-10">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                    >
                        <div className="w-24 h-24 bg-bt-primary rounded-full flex items-center justify-center text-white bt-title shadow-deep">
                            {user?.name?.[0]?.toUpperCase() || 'P'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-bt-accent-green border-4 border-white rounded-full flex items-center justify-center text-white">
                            <Activity size={12} />
                        </div>
                    </motion.div>
                    <h2 className="bt-title2 mt-4 text-bt-text-primary">{user?.name}</h2>
                    <p className="bt-caption text-bt-text-second">ID: {user?.patient_id}</p>
                </div>

                <div className="flex flex-col gap-8">
                    <ProfileSection title="Personal Information">
                        <DetailRow icon={User} label="Gender" value={user?.gender || 'N/A'} />
                        <DetailRow icon={Calendar} label="Age" value={`${user?.age} years`} />
                        <DetailRow icon={Briefcase} label="Occupation" value={user?.occupation || 'N/A'} />
                        <DetailRow icon={Phone} label="Contact" value={user?.phone_number || 'N/A'} />
                    </ProfileSection>

                    <ProfileSection title="Physical Vitals">
                        <div className="grid grid-cols-2 gap-4">
                            <VitalsBox icon={Ruler} label="Height" value={`${user?.height} cm`} color="var(--bt-primary)" />
                            <VitalsBox icon={Weight} label="Weight" value={`${user?.weight} kg`} color="var(--bt-accent-purple)" />
                        </div>
                    </ProfileSection>

                    <ProfileSection title="Medical Account">
                        <DetailRow icon={Activity} label="Primary Diagnosis" value={user?.diagnosis || 'COPD'} />
                        <DetailRow icon={Mail} label="Email" value={user?.email || `${user?.patient_id}@breathtrack.com`} />
                    </ProfileSection>

                    <div className="mt-4 pt-4 border-t border-bt-border">
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-between p-4 bg-bt-accent/5 rounded-2xl text-bt-accent hover:bg-bt-accent/10 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <LogOut size={20} />
                                <span className="bt-headline">Sign Out</span>
                            </div>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileSection = ({ title, children }) => (
    <div className="flex flex-col gap-3">
        <h3 className="bt-caption2 text-bt-text-tertiary ml-1">{title}</h3>
        <BTCard className="border border-bt-border overflow-hidden">
            <div className="flex flex-col">
                {children}
            </div>
        </BTCard>
    </div>
);

const DetailRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4 p-4 border-b last:border-b-0 border-bt-border">
        <div className="text-bt-text-tertiary"><Icon size={20} /></div>
        <div className="flex flex-col">
            <span className="bt-caption text-bt-text-second">{label}</span>
            <span className="bt-body-medium text-bt-text-primary">{value}</span>
        </div>
    </div>
);

const VitalsBox = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white border border-bt-border p-5 rounded-[24px] flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
            <Icon size={20} />
        </div>
        <span className="bt-caption text-bt-text-second">{label}</span>
        <span className="bt-headline">{value}</span>
    </div>
);

export default Profile;
