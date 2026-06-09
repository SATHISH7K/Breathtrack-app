import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Heart,
    User,
    Calendar,
    UserCircle,
    Ruler,
    Weight,
    Stethoscope,
    Briefcase,
    BarChart3,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { BTBackButton, BTPrimaryButton, BTCard } from '../../components/BTComponents';
import { useAuth } from '../../context/AuthContext';
import APIConfig from '../../config';

const CopdReview = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [reviewData, setReviewData] = useState(null);

    const fetchReview = async () => {
        try {
            const response = await fetch(APIConfig.getURL('get_patient_details.php'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patient_id: user.patient_id })
            });
            const data = await response.json();
            if (data.status === 'success') {
                const patient = data.patient;
                const questionnaire = data.questionnaire || {};
                setReviewData({
                    name: patient.name,
                    age: patient.age,
                    gender: patient.gender,
                    height: patient.height,
                    weight: patient.weight,
                    diagnosis: patient.diagnosis || 'Chronic Respiratory Condition',
                    occupation: patient.occupation,
                    score: questionnaire.average_score || 0
                });
            }
        } catch (error) {
            console.error("Error fetching review:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReview();
    }, []);

    if (loading) {
        return (
            <div className="page-container flex flex-col items-center justify-center p-10">
                <Loader2 className="w-10 h-10 text-bt-primary animate-spin mb-4" />
                <p className="bt-body text-bt-text-second">Summarizing your health...</p>
            </div>
        );
    }

    return (
        <div className="page-container flex flex-col">
            <div className="page-header justify-start gap-4">
                <BTBackButton onClick={() => navigate('/patient')} />
                <h1 className="bt-headline">My COPD Review</h1>
            </div>

            <div className="page-content py-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-10"
                >
                    <div className="w-16 h-16 bg-bt-primary rounded-3xl flex items-center justify-center shadow-lg shadow-bt-primary/30">
                        <Heart className="text-white" size={32} />
                    </div>
                    <div>
                        <h1 className="bt-title2 text-bt-text-primary">Health Profile Summary</h1>
                        <p className="bt-caption text-bt-text-second text-lg">Personal data & metrics</p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                    <ModernTile icon={User} title="Name" value={reviewData?.name || '—'} color="var(--bt-primary)" delay={0.1} />
                    <ModernTile icon={Calendar} title="Age" value={`${reviewData?.age || '—'} yrs`} color="var(--bt-accent-orange)" delay={0.15} />
                    <ModernTile icon={UserCircle} title="Gender" value={reviewData?.gender || '—'} color="var(--bt-accent-purple)" delay={0.2} />
                    <ModernTile icon={Ruler} title="Height" value={`${reviewData?.height || '—'} cm`} color="var(--bt-accent-green)" delay={0.25} />
                    <ModernTile icon={Weight} title="Weight" value={`${reviewData?.weight || '—'} kg`} color="var(--bt-accent)" delay={0.3} />
                    <ModernTile icon={Stethoscope} title="Diagnosis" value={reviewData?.diagnosis || '—'} color="#5A67D8" delay={0.35} />
                    <ModernTile icon={Briefcase} title="Occupation" value={reviewData?.occupation || '—'} color="#D69E2E" delay={0.4} />

                    <BTCard
                        className="flex flex-col items-center justify-center p-6 border-2 border-bt-accent/30 bg-bt-accent/5 cursor-pointer"
                        onClick={() => navigate('/patient/analysis')}
                    >
                        <BarChart3 className="text-bt-accent mb-2" size={32} />
                        <p className="bt-caption2 text-bt-text-second">MY ANALYSIS</p>
                        <h2 className="bt-title text-bt-text-primary mb-2">
                            {parseFloat(reviewData?.score || 0).toFixed(2)}
                        </h2>
                        <div className="flex items-center gap-1 text-bt-accent bt-caption font-bold">
                            View Detail <ArrowRight size={14} />
                        </div>
                    </BTCard>
                </div>
            </div>
        </div>
    );
};

const ModernTile = ({ icon: Icon, title, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        className="bg-white rounded-[28px] p-6 shadow-card border border-bt-border/50 flex flex-col items-center text-center gap-2"
    >
        <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-1"
            style={{ backgroundColor: `${color}15` }}
        >
            <Icon size={24} style={{ color }} />
        </div>
        <p className="bt-caption2 text-bt-text-tertiary">{title}</p>
        <p className="bt-headline text-bt-text-primary leading-tight">{value}</p>
    </motion.div>
);

export default CopdReview;
