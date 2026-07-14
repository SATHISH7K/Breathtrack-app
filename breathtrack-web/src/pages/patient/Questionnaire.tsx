import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle2, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiCall } from '../../api/apiService';
import BTPrimaryButton from '../../components/BTPrimaryButton';
import './Dashboard.css';

const questions = [
    {
        id: 'q1',
        text: 'I never cough vs. I cough all the time',
    },
    {
        id: 'q2',
        text: 'I have no phlegm in my chest vs. My chest is completely full of phlegm',
    },
    {
        id: 'q3',
        text: 'My chest does not feel tight vs. My chest feels very tight',
    },
    {
        id: 'q4',
        text: 'When I walk up a hill or one flight of stairs I am not breathless vs. I am very breathless',
    },
    {
        id: 'q5',
        text: 'I am not limited doing any activities at home vs. I am very limited doing activities',
    },
    {
        id: 'q6',
        text: 'I am confident leaving my home despite my lung condition vs. I am not confident at all',
    },
    {
        id: 'q7',
        text: 'I sleep soundly vs. I don\'t sleep soundly because of my lung condition',
    },
    {
        id: 'q8',
        text: 'I have lots of energy vs. I have no energy',
    }
];

const Questionnaire: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [answers, setAnswers] = useState<number[]>(Array(8).fill(0));
    const [loading, setLoading] = useState(false);
    const [existingData, setExistingData] = useState<any>(null);

    useEffect(() => {
        const fetchExisting = async () => {
            if (!user) return;
            const res = await apiCall('get_questionnaires.php', 'POST', { patient_id: user.id });
            if (res.status === 'success') {
                setExistingData(res.data);
            }
        };
        fetchExisting();
    }, [user]);

    const handleSelect = (qIndex: number, score: number) => {
        const newAnswers = [...answers];
        newAnswers[qIndex] = score;
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);

        // Map answers to the exact keys expect by save_copd_questionnaire.php
        // The PHP expects q1, q2, q3... q8 and calculates cat_score.
        const payload = {
            patient_id: user.id,
            q1: answers[0],
            q2: answers[1],
            q3: answers[2],
            q4: answers[3],
            q5: answers[4],
            q6: answers[5],
            q7: answers[6],
            q8: answers[7]
        };

        const res = await apiCall('save_copd_questionnaire.php', 'POST', payload);
        setLoading(false);

        if (res.status === 'success') {
            navigate('/patient/dashboard');
        } else {
            alert(res.message || 'Error saving questionnaire');
        }
    };

    return (
        <div className="dashboard-screen" style={{ overflowY: 'auto' }}>
            <header className="meds-header" style={{ padding: '24px', background: 'var(--bt-primary)' }}>
                <button className="back-btn" onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', display: 'flex' }}>
                    <ChevronLeft size={28} />
                </button>
                <h1 style={{ color: 'white', marginLeft: '12px' }}>CAT Assessment</h1>
            </header>

            <div style={{ padding: '24px' }}>
                {existingData && (
                    <div className="status-pill" style={{ margin: '0 auto 24px auto', width: 'fit-content' }}>
                        <FileText size={16} />
                        <span style={{ marginLeft: '8px' }}>
                            Previous Score: {existingData.total_score || existingData.cat_score || '--'}
                        </span>
                    </div>
                )}

                <div style={{ marginBottom: '24px' }}>
                    <p style={{ color: 'var(--bt-text-second)' }}>
                        For each item below, select the number that best describes you currently (0 = Best, 5 = Worst).
                    </p>
                </div>

                {questions.map((q, index) => (
                    <motion.div
                        key={q.id}
                        className="action-cards-grid"
                        style={{ marginBottom: '24px', padding: '16px', background: 'var(--bt-surface)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <h4 style={{ marginBottom: '16px', lineHeight: '1.4' }}>{index + 1}. {q.text}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                            {[0, 1, 2, 3, 4, 5].map(score => {
                                const isSelected = answers[index] === score;
                                return (
                                    <button
                                        key={score}
                                        onClick={() => handleSelect(index, score)}
                                        style={{
                                            flex: 1,
                                            height: '44px',
                                            borderRadius: '12px',
                                            border: `2px solid ${isSelected ? 'var(--bt-primary)' : 'var(--bt-surface2)'}`,
                                            background: isSelected ? 'var(--bt-primary)' : 'transparent',
                                            color: isSelected ? 'white' : 'var(--bt-text-primary)',
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {score}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}

                <div style={{ margin: '32px 0 48px 0' }}>
                    <BTPrimaryButton onClick={handleSubmit} loading={loading} icon={<CheckCircle2 size={20} />}>
                        Submit Assessment
                    </BTPrimaryButton>
                </div>
            </div>
        </div>
    );
};

export default Questionnaire;
