import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Clock, Pill, Activity, Calendar, Trash2, ShieldPlus } from 'lucide-react';
import { BTBackButton, BTCard, BTPrimaryButton } from '../../components/BTComponents';
import { useAuth } from '../../context/AuthContext';

const Reminders = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Mock reminders since web doesn't have same native notification access
    const [reminders, setReminders] = useState([
        { id: 1, title: 'Morning Inhaler', time: '08:00 AM', type: 'medication', active: true },
        { id: 2, title: 'Health Checkup', time: '10:30 AM', type: 'checkup', active: true },
        { id: 3, title: 'Evening Inhaler', time: '08:00 PM', type: 'medication', active: true },
    ]);

    const deleteReminder = (id) => {
        setReminders(prev => prev.filter(r => r.id !== id));
    };

    return (
        <div className="page-container flex flex-col">
            <div className="page-header justify-between">
                <BTBackButton onClick={() => navigate('/patient')} />
                <h1 className="page-title">Reminders</h1>
                <div className="w-11" />
            </div>

            <div className="page-content">
                <div className="mt-4 mb-8">
                    <h2 className="bt-title text-bt-text-primary mb-2">Daily Schedule</h2>
                    <p className="bt-body text-bt-text-second">Stay consistent with your health routine.</p>
                </div>

                {reminders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-20 text-center text-bt-text-tertiary">
                        <Bell size={64} className="mb-4 opacity-20" />
                        <p className="bt-body">No reminders set for today.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {reminders.map((reminder, idx) => (
                            <motion.div
                                key={reminder.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <BTCard className="p-5 flex items-center justify-between border border-bt-border">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center`}
                                            style={{
                                                backgroundColor: reminder.type === 'medication' ? 'var(--bt-primary)15' : 'var(--bt-accent-green)15',
                                                color: reminder.type === 'medication' ? 'var(--bt-primary)' : 'var(--bt-accent-green)'
                                            }}
                                        >
                                            {reminder.type === 'medication' ? <Pill size={24} /> : <Activity size={24} />}
                                        </div>
                                        <div>
                                            <h3 className="bt-headline">{reminder.title}</h3>
                                            <div className="flex items-center gap-1 text-bt-text-second">
                                                <Clock size={12} />
                                                <span className="bt-caption font-semibold">{reminder.time}</span>
                                                <span className="bt-caption ml-2">• Every Day</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteReminder(reminder.id)}
                                        className="p-3 text-bt-text-tertiary hover:text-bt-accent transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </BTCard>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="mt-12 flex flex-col items-center gap-6">
                    <div className="p-6 bg-bt-surface2 rounded-[32px] border-2 border-dashed border-bt-border text-center w-full">
                        <ShieldPlus size={32} className="text-bt-text-tertiary mb-2 mx-auto" />
                        <p className="bt-caption text-bt-text-second">Manage your system notification settings to receive these alerts on your device.</p>
                    </div>

                    <BTPrimaryButton
                        title="Add New Reminder"
                        icon={Plus}
                        variant="primary"
                        className="mt-4"
                        onClick={() => alert("Reminder creation is currently handled within the iOS app.")}
                    />
                </div>
            </div>
        </div>
    );
};

const Plus = ({ size, className }) => <span className={className}>+</span>;

export default Reminders;
