import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardList, Pill, PlayCircle, ChevronRight,
    ArrowLeft, Calendar, FileText, Download,
    Stethoscope, Info, Activity, Heart, ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import APIConfig from '../../config';

const FinalAdvice = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        reports: [],
        medication: { medicines: [], remarks: 'No remarks provided by doctor yet.' }
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [medRes, pftRes, abgRes] = await Promise.all([
                fetch(APIConfig.getURL(`get_medication_diary.php?patient_id=${user.patient_id}`)),
                fetch(APIConfig.getURL('get_pft.php'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ patient_id: user.patient_id })
                }),
                fetch(APIConfig.getURL('get_abg.php'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ patient_id: user.patient_id })
                })
            ]);

            const [medData, pftData, abgData] = await Promise.all([
                medRes.json(),
                pftRes.json(),
                abgRes.json()
            ]);

            const reports = [];
            if (pftData.status === 'success' && pftData.data) reports.push({ ...pftData.data, type: 'PFT', title: 'Pulmonary Function Test' });
            if (abgData.status === 'success' && abgData.data) reports.push({ ...abgData.data, type: 'ABG', title: 'Arterial Blood Gas' });

            setData({
                reports,
                medication: medData.status === 'success' ? {
                    medicines: medData.medicines ? JSON.parse(medData.medicines) : [],
                    remarks: medData.remarks || 'No remarks provided by doctor yet.'
                } : { medicines: [], remarks: 'No remarks provided by doctor yet.' }
            });
        } catch (err) {
            console.error("Fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container flex flex-col bg-[#F4F6FB] min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/70 backdrop-blur-2xl border-b border-[#E5E5EA] pt-14 pb-4 px-6 flex items-center justify-between">
                <button onClick={() => navigate('/patient')} className="w-10 h-10 rounded-xl bg-white shadow-sm border border-[#E5E5EA] flex items-center justify-center text-[#1C1C1E] active:scale-95 transition-all">
                    <ArrowLeft size={18} strokeWidth={2.5} />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest mb-0.5">Clinical Portal</span>
                    <span className="text-[17px] font-extrabold text-[#1C1C1E]">Care Plan</span>
                </div>
                <div className="w-10" />
            </div>

            <div className="page-content pt-8 pb-32">
                <AnimatePresence>
                    {loading ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-12 h-12 border-4 border-[#5B4CF5] border-t-transparent rounded-full animate-spin" />
                            <p className="text-[#8E8E93] font-bold text-sm tracking-wide">Synthesizing Care Plan...</p>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-10">

                            {/* Hero Section */}
                            <div className="flex flex-col gap-3">
                                <span className="bg-[#5B4CF5]/10 text-[#5B4CF5] text-[10px] font-black uppercase tracking-[2px] py-1.5 px-3 rounded-lg w-fit">
                                    Patient ID: {user.patient_id}
                                </span>
                                <h1 className="text-[34px] font-black text-[#1C1C1E] tracking-tight leading-none pt-2">Treatment Advice</h1>
                                <p className="text-[#8E8E93] text-lg font-medium leading-relaxed max-w-[320px]">
                                    Your personalized clinical guidance and medical records.
                                </p>
                            </div>

                            {/* Section 1: Health Review */}
                            <div className="flex flex-col gap-4">
                                <SectionHeader title="Clinical Assessments" />
                                <ActionCard
                                    title="COPD Health Review"
                                    desc="Daily medical checklist & status"
                                    icon={ClipboardList}
                                    theme="#5B4CF5"
                                    onClick={() => navigate('/patient/review')}
                                />
                            </div>

                            {/* Section 2: Medical Reports */}
                            <div className="flex flex-col gap-4">
                                <SectionHeader title="Diagnostic Reports" badge={data.reports.length} />
                                {data.reports.length > 0 ? (
                                    <div className="flex flex-col gap-3">
                                        {data.reports.map((report, i) => (
                                            <ReportItem key={i} report={report} />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyCard text="No recent lab reports found." />
                                )}
                            </div>

                            {/* Section 3: Medication */}
                            <div className="flex flex-col gap-4">
                                <SectionHeader title="Prescribed Plan" />
                                <div className="bg-white rounded-[32px] p-6 shadow-card border border-[#E5E5EA]/50">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-[#FF9500]/10 rounded-2xl flex items-center justify-center text-[#FF9500]">
                                            <Pill size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[17px] font-extrabold text-[#1C1C1E]">Medical Remarks</p>
                                            <p className="text-[12px] text-[#8E8E93] font-bold">Updated {new Date().toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-[#F8F9FE] rounded-2xl border border-[#E5E5EA]/30 mb-6">
                                        <p className="text-[15px] font-medium text-[#3A3A3C] leading-relaxed italic">
                                            "{data.medication.remarks}"
                                        </p>
                                    </div>
                                    <button onClick={() => navigate('/patient/medication')} className="w-full h-14 bg-[#F2F2F7] rounded-xl flex items-center justify-center gap-2 text-[#5B4CF5] font-black text-sm active:scale-95 transition-all">
                                        View Full Medication Log <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Section 4: Resources */}
                            <div className="flex flex-col gap-4">
                                <SectionHeader title="Educational Support" />
                                <ActionCard
                                    title="Learning Center"
                                    desc="Videos & respiratory exercises"
                                    icon={PlayCircle}
                                    theme="#34C759"
                                    onClick={() => navigate('/patient/resources')}
                                />
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Floating Aid */}
            <div className="fixed bottom-8 right-6 z-30">
                <button className="w-14 h-14 bg-[#5B4CF5] rounded-full shadow-2xl flex items-center justify-center text-white ring-4 ring-[#5B4CF5]/20 active:scale-90 transition-all">
                    <Stethoscope size={24} />
                </button>
            </div>
        </div>
    );
};

const SectionHeader = ({ title, badge }) => (
    <div className="flex items-center justify-between mb-1 px-1">
        <h3 className="text-[13px] font-black text-[#8E8E93] uppercase tracking-[1.5px]">{title}</h3>
        {badge !== undefined && (
            <span className="bg-[#E5E5EA] text-[#8E8E93] text-[10px] font-black px-2 py-0.5 rounded-full">{badge} Records</span>
        )}
    </div>
);

const ActionCard = ({ title, desc, icon: Icon, theme, onClick }) => (
    <button onClick={onClick} className="w-full bg-white rounded-[32px] p-6 shadow-card border border-[#E5E5EA]/50 flex items-center justify-between text-left active:scale-[0.98] transition-all">
        <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: theme }}>
                <Icon size={28} />
            </div>
            <div>
                <p className="text-[18px] font-extrabold text-[#1C1C1E]">{title}</p>
                <p className="text-[13px] text-[#8E8E93] font-bold">{desc}</p>
            </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#C7C7CC]">
            <ChevronRight size={20} />
        </div>
    </button>
);

const ReportItem = ({ report }) => (
    <div className="bg-white rounded-2xl p-5 border border-[#E5E5EA]/60 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#5B4CF5]/5 rounded-xl flex items-center justify-center text-[#5B4CF5]">
                <FileText size={20} />
            </div>
            <div>
                <p className="text-[15px] font-bold text-[#1C1C1E]">{report.title}</p>
                <p className="text-[11px] text-[#8E8E93] font-bold uppercase tracking-wider">{new Date(report.created_at || Date.now()).toLocaleDateString('en-GB')}</p>
            </div>
        </div>
        <button className="p-2 text-[#5B4CF5] hover:bg-[#5B4CF5]/5 rounded-lg transition-colors">
            <Download size={18} />
        </button>
    </div>
);

const EmptyCard = ({ text }) => (
    <div className="bg-white/40 rounded-[24px] p-8 border border-dashed border-[#E5E5EA] text-center">
        <p className="text-[13px] text-[#8E8E93] font-bold">{text}</p>
    </div>
);

export default FinalAdvice;
