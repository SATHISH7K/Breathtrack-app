import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, ClipboardList, Activity, Droplets, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { BTBackButton, BTCard, BTPrimaryButton, BTStatusBadge } from '../../components/BTComponents';
import APIConfig from '../../config';

const PatientReports = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchText, setSearchText] = useState(location.state?.patientId || '');
    const [loading, setLoading] = useState(false);
    const [reports, setReports] = useState([]);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (searchText) handleSearch();
    }, []);

    const handleSearch = async () => {
        if (!searchText) return;
        setLoading(true);
        setError('');
        setReports([]);

        try {
            // Search for reports (Unified search in the iOS app calls multiple APIs)
            const pftRes = await fetch(APIConfig.getURL('get_pft_report.php'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patient_id: searchText })
            });
            const pftData = await pftRes.json();

            const abgRes = await fetch(APIConfig.getURL('get_abg_report.php'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patient_id: searchText })
            });
            const abgData = await abgRes.json();

            const results = [];
            if (pftData.status === 'success') results.push({ ...pftData.data, type: 'PFT', icon: Activity, color: 'var(--bt-primary)' });
            if (abgData.status === 'success') results.push({ ...abgData.data, type: 'ABG', icon: Droplets, color: 'var(--bt-accent)' });

            if (results.length === 0) {
                setError('No historical reports found for this ID.');
            } else {
                setReports(results);
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container flex flex-col pb-12">
            <div className="page-header justify-between">
                <BTBackButton onClick={() => navigate('/doctor')} />
                <h1 className="page-title">Report Search</h1>
                <div className="w-11" />
            </div>

            <div className="px-6 py-4 flex gap-3 sticky top-[65px] bg-white z-10 border-b border-bt-border">
                <div className="bt-input-wrapper flex-grow">
                    <Search size={18} className="text-bt-text-tertiary" />
                    <input
                        type="text"
                        placeholder="Patient ID (e.g. pat_133)"
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <button
                    onClick={handleSearch}
                    className="px-6 bg-bt-doctor-primary text-white bt-headline text-sm rounded-2xl shadow-lg active:scale-95 transition-transform"
                >
                    Search
                </button>
            </div>

            <div className="page-content pt-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20 gap-4">
                        <div className="w-10 h-10 border-4 border-bt-doctor-primary border-t-transparent rounded-full animate-spin" />
                        <p className="bt-caption text-bt-text-tertiary">Scanning database...</p>
                    </div>
                ) : reports.length === 0 ? (
                    <div className="text-center p-12 py-20 flex flex-col items-center gap-4">
                        {error ? (
                            <>
                                <AlertCircle size={64} className="text-bt-accent opacity-50" />
                                <p className="bt-body text-bt-accent font-medium">{error}</p>
                                <button onClick={() => setSearchText('')} className="text-bt-doctor-primary bt-caption font-bold underline">Clear Search</button>
                            </>
                        ) : (
                            <>
                                <FileText size={64} className="text-bt-text-tertiary opacity-20" />
                                <p className="bt-body text-bt-text-tertiary max-w-[200px]">Enter a patient ID above to review clinical reports.</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        <div className="bg-bt-doctor-primary/5 p-4 rounded-2xl flex items-center gap-4 border border-bt-doctor-primary/10">
                            <div className="w-10 h-10 bg-bt-doctor-primary rounded-xl flex items-center justify-center text-white"><FileText size={20} /></div>
                            <div>
                                <h3 className="bt-headline">Registry Results</h3>
                                <p className="bt-caption text-bt-text-second">Patient ID: <span className="font-bold text-bt-doctor-primary">{searchText}</span></p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5">
                            {reports.map((report, idx) => (
                                <ReportItem
                                    key={idx}
                                    report={report}
                                    onImageClick={setSelectedImage}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedImage && (
                    <div className="fullscreen-overlay" onClick={() => setSelectedImage(null)}>
                        <button className="fullscreen-close"><X size={24} /></button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src={`${APIConfig.baseURL}/${selectedImage}`}
                            alt="Report Detail"
                            className="max-w-[90%] max-h-[80%] rounded-xl shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ReportItem = ({ report, onImageClick }) => (
    <BTCard className="p-6 border border-bt-border overflow-hidden">
        <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${report.color}15`, color: report.color }}>
                    <report.icon size={24} />
                </div>
                <div>
                    <h3 className="bt-headline">{report.title}</h3>
                    <p className="bt-caption font-bold" style={{ color: report.color }}>{report.condition || "STATUS UNKNOWN"}</p>
                </div>
            </div>
            <div className="bt-caption2 text-bt-text-tertiary">
                {new Date(report.created_at).toLocaleDateString()}
            </div>
        </div>

        <div className="p-4 bg-bt-surface2 rounded-2xl border border-bt-border mb-6">
            <p className="bt-caption2 text-bt-text-tertiary mb-1">Clinical Remarks</p>
            <p className="bt-body text-sm text-bt-text-primary leading-relaxed">{report.comments || "No doctor remarks provided."}</p>
        </div>

        {report.image_path && (
            <div
                className="w-full relative group cursor-pointer overflow-hidden rounded-2xl border border-bt-border shadow-sm block aspect-video max-w-[320px] mx-auto"
                onClick={() => onImageClick(report.image_path)}
            >
                <img
                    src={`${APIConfig.baseURL}/${report.image_path}`}
                    alt="Technical scan"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImageIcon size={32} className="text-white mb-2" />
                    <span className="text-white bt-caption2 font-bold">View Full Report</span>
                </div>
            </div>
        )}
    </BTCard>
);

export default PatientReports;
