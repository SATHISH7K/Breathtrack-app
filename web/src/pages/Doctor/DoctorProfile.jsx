import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, User, Mail, Award, MapPin, LogOut, ChevronRight, Activity, ShieldCheck } from 'lucide-react';
import { BTBackButton, BTCard } from '../../components/BTComponents';
import { useAuth } from '../../context/AuthContext';

const DoctorProfile = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    return (
        <div className="page-container flex flex-col pb-12">
            <div className="page-header justify-between">
                <BTBackButton onClick={() => navigate('/doctor')} />
                <h1 className="page-title">Doctor Profile</h1>
                <div className="w-11" />
            </div>

            <div className="page-content">
                <div className="flex flex-col items-center mt-6 mb-10">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                    >
                        <div className="w-24 h-24 bg-bt-doctor-primary rounded-3xl rotate-3 flex items-center justify-center text-white bt-title shadow-deep">
                            <span className="-rotate-3">{user?.name?.[0]?.toUpperCase() || 'D'}</span>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border-2 border-bt-border rounded-2xl flex items-center justify-center text-bt-doctor-primary shadow-lg">
                            <ShieldCheck size={20} />
                        </div>
                    </motion.div>
                    <h2 className="bt-title2 mt-6 text-bt-text-primary">{user?.name}</h2>
                    <p className="bt-body text-bt-text-second font-medium">Respiratory Specialist</p>
                    <p className="bt-caption text-bt-text-tertiary mt-1">ID: {user?.doctor_id}</p>
                </div>

                <div className="flex flex-col gap-8">
                    <ProfileSection title="Professional Background">
                        <DetailRow icon={Award} label="Specialization" value="Pulmonology & Critical Care" />
                        <DetailRow icon={Activity} label="Experience" value="12+ Years Practice" />
                        <DetailRow icon={MapPin} label="Practice Location" value="BreathTrack Medical Centre, Suite 402" />
                    </ProfileSection>

                    <ProfileSection title="Digital Context">
                        <DetailRow icon={Mail} label="Professional Email" value={`${user?.doctor_id.toLowerCase()}@breathtrack.org`} />
                        <DetailRow icon={Stethoscope} label="Provider Status" value="Verified Medical Specialist" />
                    </ProfileSection>

                    <div className="mt-4 pt-4">
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-between p-5 bg-bt-accent/5 rounded-[28px] text-bt-accent hover:bg-bt-accent/10 transition-colors border border-bt-accent/10"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                    <LogOut size={20} />
                                </div>
                                <span className="bt-headline">End Practitioner Session</span>
                            </div>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <p className="mt-12 text-center bt-caption text-bt-text-tertiary px-10">
                    This profile is verified by the central BreathTrack registry system.
                </p>
            </div>
        </div>
    );
};

const ProfileSection = ({ title, children }) => (
    <div className="flex flex-col gap-3">
        <h3 className="bt-caption2 text-bt-text-tertiary ml-1 font-bold tracking-widest">{title}</h3>
        <BTCard className="border border-bt-border overflow-hidden">
            <div className="flex flex-col">
                {children}
            </div>
        </BTCard>
    </div>
);

const DetailRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4 p-5 border-b last:border-b-0 border-bt-border hover:bg-bt-surface transition-colors cursor-default">
        <div className="w-10 h-10 rounded-xl bg-bt-background flex items-center justify-center text-bt-text-tertiary"><Icon size={20} /></div>
        <div className="flex flex-col">
            <span className="text-[10px] uppercase font-black text-bt-text-tertiary tracking-wider mb-0.5">{label}</span>
            <span className="bt-body-medium text-bt-text-primary text-[15px]">{value}</span>
        </div>
    </div>
);

export default DoctorProfile;
