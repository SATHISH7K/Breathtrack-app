import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Thermometer,
    Activity,
    Wind,
    CheckCircle2,
    XCircle,
    Loader2,
    ShieldCheck,
    ClipboardCheck
} from 'lucide-react';
import { BTBackButton, BTCard, BTStatusBadge } from '../../components/BTComponents';
import { useAuth } from '../../context/AuthContext';
import APIConfig from '../../config';

const Analysis = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    const fetchAnalysis = async () => {
        try {
            const response = await fetch(APIConfig.getURL('get_patient_details.php'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patient_id: user.patient_id })
            });
            const json = await response.json();
            if (json.status === 'success') {
                const patient = json.patient;
                const checkup = json.checkup || {};
                const questionnaire = json.questionnaire || {};

                const score = parseFloat(questionnaire.average_score || 0);
                const scoreLabel = score < 1.0 ? "Low" : (score < 3.0 ? "Moderate" : "High");

                setData({
                    name: patient.name,
                    age: patient.age,
                    gender: patient.gender,
                    height: patient.height,
                    weight: patient.weight,
                    occupation: patient.occupation,
                    diagnosis: patient.diagnosis || 'Chronic Respiratory Condition',
                    scoreDisplay: `${score.toFixed(2)} (${scoreLabel})`,
                    scoreLabel,
                    vitals: [
                        { icon: Thermometer, title: "Temp", value: checkup.temperature || '—', suffix: "°F", color: "var(--bt-accent-orange)" },
                        { icon: Activity, title: "SpO₂", value: checkup.oxygen_level || '—', suffix: "%", color: "var(--bt-primary)" },
                        { icon: Wind, title: "Lung", value: checkup.lung_function || '—', suffix: "%", color: "var(--bt-accent-purple)" },
                    ],
                    vaccines: [
                        { name: "Pneumococcal", date: questionnaire.date_pneumococcal || questionnaire.pneumococcal || "N/A" },
                        { name: "Flu Vaccine", date: questionnaire.date_flu || questionnaire.flu || "N/A" },
                        { name: "Pertussis", date: questionnaire.date_pertussis || questionnaire.pertussis || "N/A" },
                        { name: "Shingles - Dose 1", date: questionnaire.date_shingles1 || questionnaire.shingles1 || "N/A" },
                        { name: "Shingles - Dose 2", date: questionnaire.date_shingles2 || questionnaire.shingles2 || "N/A" },
                    ],
                    questions: [
                        { q: "Q1. Cough", a: questionnaire.q1_cough || questionnaire.cough },
                        { q: "Q2. Phlegm", a: questionnaire.q2_phlegm || questionnaire.phlegm },
                        { q: "Q3. Chest tightness", a: questionnaire.q3_chest_tightness || questionnaire.chest_tightness },
                        { q: "Q4. Energy level", a: questionnaire.q4_breathlessness || questionnaire.breathlessness },
                        { q: "Q5. Sleep quality", a: questionnaire.q5_activity_limitation || questionnaire.activity_limitation },
                        { q: "Q6. Confidence leaving home", a: questionnaire.q6_confidence_leaving_home || questionnaire.confidence_leaving_home },
                        { q: "Q7. Outdoor activities", a: questionnaire.q7_sleep_quality || questionnaire.sleep_quality },
                        { q: "Q8. Climbing stairs", a: questionnaire.q8_energy_level || questionnaire.energy_level }
                    ]
                });
            }
        } catch (error) {
            console.error("Error fetching analysis:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalysis();
    }, []);

    const getCatColor = (cat) => {
        if (cat === "Low") return "var(--bt-accent-green)";
        if (cat === "Moderate") return "var(--bt-accent-orange)";
        return "var(--bt-accent)";
    };

    if (loading) {
        return (
            <div className="page-container flex flex-col items-center justify-center p-10">
                <Loader2 className="w-10 h-10 text-bt-primary animate-spin mb-4" />
                <p className="bt-body text-bt-text-second">Analyzing your records...</p>
            </div>
        );
    }

    return (
        <div className="page-container flex flex-col pb-10">
            <div className="page-header justify-start gap-4 sticky top-0 bg-bt-background z-20">
                <BTBackButton onClick={() => navigate('/patient/review')} />
                <h1 className="bt-headline">My Analysis</h1>
            </div>

            <div className="page-content py-4">
                {/* Summary Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[32px] p-6 shadow-card border border-bt-border mb-8"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="bt-title2 text-bt-text-primary">{data?.name}</h2>
                            <p className="bt-body-medium text-bt-text-second">{data?.age} yrs • {data?.gender}</p>
                        </div>
                        <div className="text-right">
                            <h1 className="text-4xl font-black text-bt-primary">
                                {data?.scoreDisplay.split(' ')[0]}
                            </h1>
                            <span
                                className="bt-caption2 px-3 py-1 rounded-full text-white inline-block mt-1"
                                style={{ backgroundColor: getCatColor(data?.scoreLabel) }}
                            >
                                {data?.scoreLabel}
                            </span>
                        </div>
                    </div>
                    <div className="h-px bg-bt-border w-full mb-6" />
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="flex flex-col gap-1">
                            <span className="bt-caption2 text-bt-text-tertiary">HEIGHT</span>
                            <span className="bt-headline text-bt-text-primary">{data?.height} cm</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="bt-caption2 text-bt-text-tertiary">WEIGHT</span>
                            <span className="bt-headline text-bt-text-primary">{data?.weight} kg</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="bt-caption2 text-bt-text-tertiary">JOB</span>
                            <span className="bt-headline text-bt-text-primary truncate">{data?.occupation}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="bt-caption2 text-bt-text-tertiary">PRIMARY DIAGNOSIS</span>
                        <span className="bt-headline text-bt-text-primary">{data?.diagnosis}</span>
                    </div>
                </motion.div>

                {/* Vitals Section */}
                <h2 className="bt-headline mb-4 px-2">Vital Signs</h2>
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {data?.vitals.map((v, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * i }}
                            className="bg-white rounded-3xl p-4 shadow-card border border-bt-border flex flex-col items-center gap-2"
                        >
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: `${v.color}15` }}
                            >
                                <v.icon size={20} style={{ color: v.color }} />
                            </div>
                            <div className="text-center">
                                <p className="bt-headline text-bt-text-primary leading-none mb-1">
                                    {v.value !== '—' ? `${parseFloat(v.value).toFixed(1)}${v.suffix}` : 'N/A'}
                                </p>
                                <p className="bt-caption2 text-bt-text-tertiary">{v.title}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Vaccines Section */}
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="bt-headline">Vaccination Details</h2>
                    <ShieldCheck size={20} className="text-bt-primary" />
                </div>
                <BTCard className="p-6 mb-8 border border-bt-border">
                    <div className="flex flex-col gap-4">
                        {data?.vaccines.map((v, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <span className="bt-body-medium text-bt-text-primary">{v.name}</span>
                                <div className={`flex items-center gap-2 bt-headline ${v.date === 'N/A' ? 'text-bt-text-tertiary' : 'text-bt-accent-green'}`}>
                                    {v.date === 'N/A' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                                    <span>{v.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </BTCard>

                {/* Question Section */}
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="bt-headline">Questionnaire Answers</h2>
                    <ClipboardCheck size={20} className="text-bt-primary" />
                </div>
                <BTCard className="overflow-hidden border border-bt-border">
                    <div className="bg-bt-surface2 px-6 py-3 flex justify-between">
                        <span className="bt-caption font-bold text-bt-text-primary">QUESTION</span>
                        <span className="bt-caption font-bold text-bt-text-primary">ANSWER</span>
                    </div>
                    <div className="flex flex-col">
                        {data?.questions.map((q, i) => (
                            <div key={i} className="px-6 py-4 flex justify-between items-start gap-4 border-b border-bt-border last:border-0 hover:bg-bt-background/50 transition-colors">
                                <span className="bt-body-medium text-bt-text-second flex-1">{q.q}</span>
                                <span className="bt-headline text-bt-text-primary text-right w-32">
                                    {getAnswerLabel(q.a)}
                                </span>
                            </div>
                        ))}
                    </div>
                </BTCard>
            </div>
        </div>
    );
};

const getAnswerLabel = (val) => {
    if (val === undefined || val === null || val === '') return "N/A";
    const i = parseInt(val);
    if (isNaN(i)) return val;
    switch (i) {
        case 0: return "0 - No symptom";
        case 1: return "1 - Very mild";
        case 2: return "2 - Mild";
        case 3: return "3 - Moderate";
        case 4: return "4 - Severe";
        case 5: return "5 - Very severe";
        default: return `${i}`;
    }
};

export default Analysis;
