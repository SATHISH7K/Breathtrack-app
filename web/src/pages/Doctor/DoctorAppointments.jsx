import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, User, ChevronRight, Check, X, Search, Bell } from 'lucide-react';
import { BTBackButton, BTCard, BTStatusBadge } from '../../components/BTComponents';
import APIConfig from '../../config';

const DoctorAppointments = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [searchText, setSearchText] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await fetch(APIConfig.getURL('fetch_appointments.php'));
            const data = await response.json();
            if (data.status === 'success') {
                setAppointments(data.appointments);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const formData = new FormData();
            formData.append('appointment_id', id);
            formData.append('status', status);

            const response = await fetch(APIConfig.getURL('update_appointment_status.php'), {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.status === 'success') {
                setSuccessMsg(`Appointment ${status.toLowerCase()}ed!`);
                setTimeout(() => setSuccessMsg(''), 3000);

                // Optimistic update
                setAppointments(prev => prev.map(app =>
                    app.appointment_id === id ? { ...app, status: status.toLowerCase() } : app
                ));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filtered = appointments.filter(app => {
        const matchesFilter = app.status === filter;
        const matchesSearch = app.name.toLowerCase().includes(searchText.toLowerCase()) ||
            app.patient_id.toLowerCase().includes(searchText.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="page-container flex flex-col pb-12 bg-bt-background">
            <div className="page-header justify-between bg-white border-b border-bt-border">
                <BTBackButton onClick={() => navigate('/doctor')} />
                <h1 className="page-title text-bt-doctor-primary">Appointments</h1>
                <div className="w-11" />
            </div>

            <div className="bg-white px-6 py-4 flex flex-col gap-4 border-b border-bt-border sticky top-[65px] z-10 transition-all">
                <div className="bt-input-wrapper bg-bt-background">
                    <Search size={18} className="text-bt-text-tertiary" />
                    <input
                        type="text"
                        placeholder="Search appointments..."
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                    />
                </div>

                <div className="segmented-picker">
                    <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>Pending</button>
                    <button className={filter === 'accepted' ? 'active' : ''} onClick={() => setFilter('accepted')}>Accepted</button>
                    <button className={filter === 'rejected' ? 'active' : ''} onClick={() => setFilter('rejected')}>Rejected</button>
                </div>
            </div>

            <div className="page-content pt-8">
                <AnimatePresence>
                    {successMsg && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6">
                            <BTStatusBadge type="success" message={successMsg} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading ? (
                    <div className="flex justify-center p-20"><div className="w-8 h-8 border-2 border-bt-doctor-primary border-t-transparent rounded-full animate-spin" /></div>
                ) : filtered.length === 0 ? (
                    <div className="text-center p-20 flex flex-col items-center gap-4">
                        <Bell size={64} className="text-bt-text-tertiary opacity-10" />
                        <p className="bt-body text-bt-text-tertiary font-medium">No {filter} appointments found.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {filtered.map((app, idx) => (
                            <motion.div
                                key={app.appointment_id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <BTCard className="p-6 border border-bt-border">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-bt-doctor-gradient flex items-center justify-center text-white bt-headline shadow-lg">
                                                {app.name[0]}
                                            </div>
                                            <div>
                                                <h3 className="bt-headline">{app.name}</h3>
                                                <p className="bt-caption text-bt-text-tertiary">ID: {app.patient_id}</p>
                                            </div>
                                        </div>
                                        {app.status === 'pending' && <div className="p-1 px-3 bg-bt-accent-orange/10 text-bt-accent-orange bt-caption2 font-bold rounded-full">New</div>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <ApptDetail icon={Calendar} label="Date" value={app.preferred_date} />
                                        <ApptDetail icon={Clock} label="Slot" value={app.preferred_time} />
                                        <ApptDetail icon={MapPin} label="Mode" value={app.consultation_mode} />
                                        <ApptDetail icon={User} label="Age/Gender" value={`${app.age}y / ${app.gender}`} />
                                    </div>

                                    {app.status === 'pending' ? (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => updateStatus(app.appointment_id, 'Accepted')}
                                                className="flex-grow h-12 flex items-center justify-center gap-2 bg-bt-accent-green text-white bt-headline rounded-2xl shadow-lg active:scale-95 transition-transform"
                                            >
                                                <Check size={18} /> Accept
                                            </button>
                                            <button
                                                onClick={() => updateStatus(app.appointment_id, 'Rejected')}
                                                className="flex-grow h-12 flex items-center justify-center gap-2 bg-white text-bt-accent border-2 border-bt-accent rounded-2xl active:scale-95 transition-transform"
                                            >
                                                <X size={18} /> Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={`p-4 rounded-xl flex items-center gap-3 ${app.status === 'accepted' ? 'bg-bt-accent-green/10 text-bt-accent-green' : 'bg-bt-accent/10 text-bt-accent'}`}>
                                            {app.status === 'accepted' ? <Check size={20} /> : <X size={20} />}
                                            <span className="bt-headline text-sm uppercase tracking-wider font-bold">Successfully {app.status}ed</span>
                                        </div>
                                    )}
                                </BTCard>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const ApptDetail = ({ icon: Icon, label, value }) => (
    <div className="flex gap-2">
        <Icon size={14} className="text-bt-text-tertiary mt-1 shrink-0" />
        <div>
            <p className="text-[10px] uppercase font-bold text-bt-text-tertiary">{label}</p>
            <p className="bt-headline text-xs text-bt-text-primary">{value}</p>
        </div>
    </div>
);

export default DoctorAppointments;
