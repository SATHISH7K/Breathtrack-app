import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Pill,
    ClipboardList,
    Info,
    Activity,
    Image as ImageIcon,
    X,
    CheckCircle2,
    Clock,
    Bell,
    AlertTriangle,
    Stethoscope
} from 'lucide-react';
import { BTBackButton, BTCard } from '../../components/BTComponents';
import { useAuth } from '../../context/AuthContext';
import APIConfig from '../../config';

const MedicationDiary = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState([]);
    const [medication, setMedication] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [appeared, setAppeared] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Medication Diary & Remarks
            const medRes = await fetch(APIConfig.getURL(`get_medication_diary.php?patient_id=${user.patient_id}`));
            const medData = await medRes.json();
            setMedication(medData.status === 'success' ? medData : null);

            const fetchedReports = [];

            // 2. Fetch PFT Report
            try {
                const pftRes = await fetch(APIConfig.getURL('get_pft.php'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ patient_id: user.patient_id })
                });
                const pftData = await pftRes.json();
                if (pftData.status === 'success') {
                    fetchedReports.push({ ...pftData.data, title: 'Pulmonary Function Test (PFT)' });
                }
            } catch (e) { console.error("PFT fetch error", e); }

            // 3. Fetch ABG Report
            try {
                const abgRes = await fetch(APIConfig.getURL('get_abg.php'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ patient_id: user.patient_id })
                });
                const abgData = await abgRes.json();
                if (abgData.status === 'success') {
                    fetchedReports.push({ ...abgData.data, title: 'Arterial Blood Gas (ABG)' });
                }
            } catch (e) { console.error("ABG fetch error", e); }

            setReports(fetchedReports);
        } catch (err) {
            console.error("Overall fetch error", err);
        } finally {
            setLoading(false);
            setAppeared(true);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const medicines = medication?.medicines ? JSON.parse(medication.medicines) : [];

    return (
        <div className="page-container flex flex-col bg-bt-background min-h-screen">
            <div className="page-header justify-between bg-bt-background sticky top-0 z-10">
                <BTBackButton onClick={() => navigate('/patient/advice')} />
                <h1 className="bt-headline">Medical Records</h1>
                <div className="w-10" />
            </div>

            <div className="page-content py-6 pb-20">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-4 border-bt-primary border-t-transparent rounded-full animate-spin" />
                        <p className="bt-body-small text-bt-text-second">Loading records...</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-10">

                        {/* Clinical Reports Section */}
                        {reports.length > 0 && (
                            <section className="flex flex-col gap-6">
                                <SectionHeader title="Clinical Reports" icon={ClipboardList} />
                                {reports.map((report, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: appeared ? 1 : 0, y: appeared ? 0 : 20 }}
                                        transition={{ delay: 0.1 + idx * 0.1 }}
                                    >
                                        <ReportCard
                                            report={report}
                                            onImageClick={(url) => setSelectedImage(url)}
                                        />
                                    </motion.div>
                                ))}
                            </section>
                        )}

                        {/* Medication & Advice Section */}
                        <section className="flex flex-col gap-6">
                            <SectionHeader title="Medication & Advice" icon={Pill} />
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: appeared ? 1 : 0, y: appeared ? 0 : 20 }}
                                transition={{ delay: 0.4 }}
                            >
                                <MedicationCard
                                    medicines={medicines}
                                    remarks={medication?.remarks}
                                />
                            </motion.div>
                        </section>
                    </div>
                )}
            </div>

            {/* Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white border-none cursor-pointer">
                            <X size={24} />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            src={`${APIConfig.getURL('').replace('/api/', '/')}${selectedImage}`}
                            alt="Report Detail"
                            className="max-w-full max-h-full rounded-2xl shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SectionHeader = ({ title, icon: Icon }) => (
    <div className="flex items-center gap-2 px-1">
        <Icon size={16} className="text-bt-primary" strokeWidth={3} />
        <span className="text-[11px] font-black text-bt-text-tertiary uppercase tracking-[2px]">{title}</span>
    </div>
);

const ReportCard = ({ report, onImageClick }) => (
    <div className="bg-white rounded-[32px] p-6 shadow-card border border-bt-border/50 flex flex-col gap-6">
        <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
                <h3 className="text-[20px] font-bold text-bt-text-primary">{report.title}</h3>
                <p className="text-[13px] font-medium text-bt-text-tertiary">Clinical Assessment</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-bt-accent-green/10 flex items-center justify-center text-bt-accent-green">
                <CheckCircle2 size={24} fill="currentColor" className="text-white" />
            </div>
        </div>

        <div className="h-px bg-bt-border/50 w-full" />

        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-bt-primary">
                    <Activity size={16} strokeWidth={3} />
                    <span className="text-[12px] font-bold uppercase tracking-wider">Current Condition</span>
                </div>
                <p className="text-[16px] font-semibold text-bt-text-primary px-1">{report.condition || "Stable"}</p>
            </div>

            <div className="flex flex-col gap-3">
                <span className="text-[13px] font-bold text-bt-text-primary px-1">Doctor's Remarks</span>
                <div className="bg-bt-background rounded-2xl p-5 border border-bt-border/50">
                    <p className="text-[15px] text-bt-text-primary italic leading-relaxed">
                        {report.comments || report.remarks || "Diagnostic results reviewed. Findings are consistent with current treatment progress."}
                    </p>
                </div>
            </div>

            {report.image_path && (
                <div
                    className="relative group cursor-pointer overflow-hidden rounded-[24px] border border-bt-border aspect-[4/3] w-full mt-2 shadow-inner bg-bt-surface"
                    onClick={() => onImageClick(report.image_path)}
                >
                    <img
                        src={`${APIConfig.getURL('').replace('/api/', '/')}${report.image_path}`}
                        alt={report.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-bt-primary/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                        <div className="bg-white p-4 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                            <ImageIcon size={24} className="text-bt-primary" />
                        </div>
                        <p className="mt-4 text-white text-[13px] font-bold uppercase tracking-widest">View Full Report</p>
                    </div>
                </div>
            )}
        </div>
    </div>
);

const MedicationCard = ({ medicines, remarks }) => {
    const [alarmTime, setAlarmTime] = useState("08:00");
    const [refillDate, setRefillDate] = useState("");
    const [refillTime, setRefillTime] = useState("12:00");
    const [taken, setTaken] = useState(false);

    return (
        <div className="bg-white rounded-[32px] p-6 shadow-card border border-bt-border/50 flex flex-col gap-8">
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <h3 className="text-[20px] font-bold text-bt-text-primary">Prescribed Medicines</h3>
                    <p className="text-[13px] font-medium text-bt-text-tertiary">Follow the dosage strictly</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-bt-primary/10 flex items-center justify-center text-bt-primary">
                    <Pill size={24} strokeWidth={2.5} />
                </div>
            </div>

            <div className="h-px bg-bt-border/50 w-full" />

            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <span className="text-[13px] font-bold text-bt-text-primary px-1">Active Prescription</span>
                    <div className="flex flex-col gap-3">
                        {medicines.length > 0 ? (
                            medicines.map((med, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-bt-primary/5 rounded-2xl border border-bt-primary/10">
                                    <div className="w-6 h-6 rounded-full bg-bt-primary flex items-center justify-center text-white">
                                        <CheckCircle2 size={14} strokeWidth={3} />
                                    </div>
                                    <span className="text-[15px] font-bold text-bt-text-primary">{med}</span>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center py-8 text-bt-text-tertiary gap-3">
                                <Info size={40} opacity={0.2} />
                                <p className="text-[14px] italic">No active prescriptions found.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <span className="text-[13px] font-bold text-bt-text-primary px-1">General Medical Advice</span>
                    <div className="bg-bt-background rounded-2xl p-5 border border-bt-border/50">
                        <p className="text-[15px] text-bt-text-primary leading-relaxed">
                            {remarks || "Continue standard respiratory care and monitor symptoms. Keep your rescue inhaler handy at all times."}
                        </p>
                    </div>
                </div>

                <div className="h-px bg-bt-border/50 w-full" />

                {/* Notifications Emulation */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <span className="text-[13px] font-bold text-bt-text-primary px-1">Inhaler Reminders</span>
                        <p className="text-[12px] text-bt-text-tertiary px-1">Configure your daily medication alerts</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-bt-background rounded-2xl border border-bt-border/50">
                        <div className="flex items-center gap-3">
                            <Clock size={20} className="text-bt-primary" />
                            <span className="text-[15px] font-bold text-bt-text-primary">Daily Alarm</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="time"
                                value={alarmTime}
                                onChange={e => setAlarmTime(e.target.value)}
                                className="bg-white border-none rounded-lg p-2 font-bold text-bt-primary cursor-pointer focus:ring-0"
                            />
                            <button
                                className="bg-bt-primary text-white text-[13px] font-bold px-4 py-2 rounded-full border-none cursor-pointer shadow-md active:scale-95 transition-all"
                                onClick={() => alert(`Alarm set for ${alarmTime}`)}
                            >
                                Set
                            </button>
                        </div>
                    </div>

                    {/* Refill Reminder */}
                    <div className="flex flex-col bg-white rounded-2xl border border-bt-accent-orange/20 overflow-hidden shadow-sm">
                        <div className="flex items-center gap-3 p-4 bg-bt-accent-orange/5">
                            <div className="w-8 h-8 rounded-full bg-bt-accent-orange/20 flex items-center justify-center text-bt-accent-orange">
                                <AlertTriangle size={16} strokeWidth={3} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[14px] font-bold text-bt-text-primary">Refill Reminder</span>
                                <span className="text-[11px] font-medium text-bt-text-tertiary">Select precise date & time</span>
                            </div>
                        </div>
                        <div className="p-4 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] font-medium text-bt-text-second">Reminder Date</span>
                                <input
                                    type="date"
                                    value={refillDate}
                                    onChange={e => setRefillDate(e.target.value)}
                                    className="bg-bt-background border-none rounded-lg p-2 font-bold text-bt-text-primary"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] font-medium text-bt-text-second">Reminder Time</span>
                                <input
                                    type="time"
                                    value={refillTime}
                                    onChange={e => setRefillTime(e.target.value)}
                                    className="bg-bt-background border-none rounded-lg p-2 font-bold text-bt-text-primary"
                                />
                            </div>
                            <button
                                className="w-full py-4 bg-bt-accent-orange text-white text-[15px] font-bold rounded-2xl border-none cursor-pointer shadow-lg shadow-bt-accent-orange/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                                onClick={() => alert("Refill reminder scheduled successfully!")}
                            >
                                <Bell size={18} /> Set Refill Alarm
                            </button>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-bt-border/50 w-full" />

                {/* Daily Dose Tracking */}
                <div className="flex flex-col gap-4">
                    <span className="text-[13px] font-bold text-bt-text-primary px-1">Daily Dose Tracking</span>
                    {taken ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-bt-accent-green/10 p-6 rounded-[24px] border border-bt-accent-green/20 flex items-center gap-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-bt-accent-green flex items-center justify-center text-white">
                                <CheckCircle2 size={24} strokeWidth={3} />
                            </div>
                            <div className="flex flex-col">
                                <h4 className="text-[18px] font-bold text-bt-accent-green">Dose Logged!</h4>
                                <p className="text-[13px] font-bold text-bt-accent-green/80 uppercase tracking-wider">Inhaler Taken Today</p>
                            </div>
                        </motion.div>
                    ) : (
                        <button
                            className="w-full py-5 bg-bt-accent-green text-white text-[16px] font-bold rounded-[24px] border-none cursor-pointer shadow-lg shadow-bt-accent-green/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                            onClick={() => setTaken(true)}
                        >
                            <Activity size={20} strokeWidth={3} /> Mark Inhaler as Taken
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicationDiary;
