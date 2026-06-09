import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Activity, Droplets, Save, FileText, ChevronRight,
    AlertCircle, CheckCircle2, ClipboardList, Info
} from 'lucide-react';
import { BTBackButton, BTPrimaryButton, BTStatusBadge, BTCard, BTInputField } from '../../components/BTComponents';
import APIConfig from '../../config';

const SubmitReport = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [patientId, setPatientId] = useState(location.state?.patientId || '');
    const [reportType, setReportType] = useState('PFT'); // PFT or ABG
    const [status, setStatus] = useState('Normal'); // Normal, Mild, Moderate, Severe
    const [comments, setComments] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!patientId || !comments) {
            setError('Please provide Patient ID and clinical comments.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const endpoint = reportType === 'PFT' ? 'submit_pft.php' : 'submit_abg.php';
            const payload = {
                patient_id: patientId,
                comments: comments,
                normal: status === 'Normal' ? 1 : 0,
                mild: status === 'Mild' ? 1 : 0,
                moderate: status === 'Moderate' ? 1 : 0,
                severe: status === 'Severe' ? 1 : 0,
                // These backends expect image_path sometimes, but for web we'll send it as empty or handle as data
                image_path: ''
            };

            const response = await fetch(APIConfig.getURL(endpoint), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (data.status === 'success') {
                setSuccess(true);
                setTimeout(() => navigate('/doctor/patients'), 2000);
            } else {
                setError(data.message || 'Submission failed');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="page-container flex flex-col items-center justify-center p-10 text-center">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <CheckCircle2 size={80} className="text-bt-accent-green mb-6 mx-auto" />
                    <h2 className="bt-title mb-2">Report Submitted</h2>
                    <p className="bt-body text-bt-text-second">Patient records have been updated successfully.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="page-container flex flex-col bg-bt-background">
            <div className="page-header justify-between bg-white/80 backdrop-blur-md">
                <BTBackButton onClick={() => navigate(-1)} />
                <h1 className="page-title text-bt-doctor-primary">Publish Report</h1>
                <div className="w-11" />
            </div>

            <div className="page-content pt-6 pb-12">
                <div className="flex flex-col gap-8">

                    {/* Patient Context */}
                    <section>
                        <h3 className="form-section-title">Patient Identification</h3>
                        <BTCard className="p-6 border border-bt-border">
                            <BTInputField
                                placeholder="Patient ID (pat_xxx)"
                                value={patientId}
                                onChange={setPatientId}
                                icon={FileText}
                            />
                        </BTCard>
                    </section>

                    {/* Report Specifics */}
                    <section>
                        <h3 className="form-section-title">Diagnostic Details</h3>
                        <div className="flex flex-col gap-4">

                            {/* Type Selector */}
                            <div className="grid grid-cols-2 gap-4">
                                <SelectionCard
                                    active={reportType === 'PFT'}
                                    onClick={() => setReportType('PFT')}
                                    icon={Activity}
                                    title="PFT Scan"
                                    color="var(--bt-primary)"
                                />
                                <SelectionCard
                                    active={reportType === 'ABG'}
                                    onClick={() => setReportType('ABG')}
                                    icon={Droplets}
                                    title="ABG Analysis"
                                    color="var(--bt-accent)"
                                />
                            </div>

                            {/* Status Selector */}
                            <BTCard className="p-6 border border-bt-border mt-2">
                                <p className="bt-caption font-bold text-bt-text-tertiary mb-4 uppercase tracking-widest text-[10px]">Clinical Status</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Normal', 'Mild', 'Moderate', 'Severe'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setStatus(s)}
                                            className={`p-3 rounded-2xl bt-headline text-xs border-2 transition-all ${status === s
                                                    ? 'bg-bt-doctor-primary border-bt-doctor-primary text-white shadow-md'
                                                    : 'bg-white border-bt-border text-bt-text-second'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </BTCard>
                        </div>
                    </section>

                    {/* Clinical Comments */}
                    <section>
                        <h3 className="form-section-title">Consolidated Remarks</h3>
                        <BTCard className="p-6 border border-bt-border">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 bg-bt-surface2 rounded-xl flex items-center justify-center text-bt-text-tertiary">
                                    <ClipboardList size={20} />
                                </div>
                                <div className="flex-grow">
                                    <textarea
                                        className="w-full bg-transparent border-none outline-none bt-body text-sm min-h-[120px] resize-none placeholder:text-bt-text-tertiary"
                                        placeholder="Enter clinical observations, advice for the patient, and any specific findings..."
                                        value={comments}
                                        onChange={e => setComments(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-bt-border/50 flex items-center gap-2 text-bt-text-tertiary">
                                <Info size={14} />
                                <p className="bt-caption2 italic">This will be visible on the patient's Medication Dashboard.</p>
                            </div>
                        </BTCard>
                    </section>

                    <div className="mt-4 flex flex-col gap-4 px-2">
                        <BTStatusBadge type="error" message={error} />
                        <BTPrimaryButton
                            title="Submit to Registry"
                            icon={Save}
                            loading={loading}
                            onClick={handleSubmit}
                            style={{ backgroundColor: 'var(--bt-doctor-primary)' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const SelectionCard = ({ active, onClick, icon: Icon, title, color }) => (
    <button
        onClick={onClick}
        className={`p-6 rounded-[32px] border-2 transition-all flex flex-col items-center gap-3 ${active
                ? 'bg-white border-bt-doctor-primary shadow-xl scale-[1.02]'
                : 'bg-bt-surface border-transparent opacity-60'
            }`}
    >
        <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: active ? 'var(--bt-doctor-primary)' : '#ccc' }}
        >
            <Icon size={24} />
        </div>
        <span className={`bt-headline text-sm ${active ? 'text-bt-doctor-primary' : 'text-bt-text-tertiary'}`}>
            {title}
        </span>
    </button>
);

export default SubmitReport;
