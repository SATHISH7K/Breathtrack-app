import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Check, Calendar, Plus, Save } from 'lucide-react';
import { BTBackButton, BTPrimaryButton, BTStatusBadge, BTCard } from '../../components/BTComponents';
import { useAuth } from '../../context/AuthContext';
import APIConfig from '../../config';

const Vaccination = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [vaccines, setVaccines] = useState({
        pneumococcal: '',
        flu: '',
        pertussis: '',
        shingles1: '',
        shingles2: ''
    });

    const fetchVaccineDates = async () => {
        try {
            const response = await fetch(APIConfig.getURL(`get_questionnaires.php?patient_id=${user.patient_id}`));
            const data = await response.json();
            if (data.status === 'success' && data.data) {
                setVaccines({
                    pneumococcal: data.data.date_pneumococcal || '',
                    flu: data.data.date_flu || '',
                    pertussis: data.data.date_pertussis || '',
                    shingles1: data.data.date_shingles1 || '',
                    shingles2: data.data.date_shingles2 || ''
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVaccineDates();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const payload = {
                patient_id: user.patient_id,
                date_pneumococcal: vaccines.pneumococcal,
                date_flu: vaccines.flu,
                date_pertussis: vaccines.pertussis,
                date_shingles1: vaccines.shingles1,
                date_shingles2: vaccines.shingles2
            };

            const response = await fetch(APIConfig.getURL('save_questionnaire.php'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (data.status === 'success') {
                setSuccess('Vaccination record updated!');
            } else {
                setError(data.message || 'Update failed');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setSaving(false);
        }
    };

    const updateDate = (key, val) => setVaccines(prev => ({ ...prev, [key]: val }));

    return (
        <div className="page-container flex flex-col">
            <div className="page-header justify-between">
                <BTBackButton onClick={() => navigate('/patient')} />
                <h1 className="page-title">Vaccination History</h1>
                <div className="w-11" />
            </div>

            <div className="page-content">
                <div className="mt-4 mb-8">
                    <h2 className="bt-title text-bt-text-primary mb-2">Stay Protected</h2>
                    <p className="bt-body text-bt-text-second">Track your immunizations for standard COPD care.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-bt-primary border-t-transparent rounded-full" /></div>
                ) : (
                    <div className="flex flex-col gap-6">
                        <VaccineCard
                            title="Shingles (Zoster)"
                            icon={Shield}
                            color="var(--bt-accent-purple)"
                            desc="Two-dose series recommended for age 50+"
                        >
                            <div className="flex flex-col gap-3 mt-4">
                                <DateRow label="Dose 1" value={vaccines.shingles1} onChange={v => updateDate('shingles1', v)} />
                                <DateRow label="Dose 2" value={vaccines.shingles2} onChange={v => updateDate('shingles2', v)} />
                            </div>
                        </VaccineCard>

                        <VaccineCard
                            title="Pneumococcal"
                            icon={Shield}
                            color="var(--bt-primary)"
                            desc="Protection against bacterial pneumonia"
                        >
                            <div className="mt-4">
                                <DateRow label="Date Administered" value={vaccines.pneumococcal} onChange={v => updateDate('pneumococcal', v)} />
                            </div>
                        </VaccineCard>

                        <VaccineCard
                            title="Annual Flu Shot"
                            icon={Shield}
                            color="var(--bt-accent)"
                            desc="Yearly seasonal protection"
                        >
                            <div className="mt-4">
                                <DateRow label="Last Vaccine Date" value={vaccines.flu} onChange={v => updateDate('flu', v)} />
                            </div>
                        </VaccineCard>

                        <VaccineCard
                            title="Pertussis (Tdap)"
                            icon={Shield}
                            color="var(--bt-accent-green)"
                            desc="Whooping cough booster"
                        >
                            <div className="mt-4">
                                <DateRow label="Last Booster Date" value={vaccines.pertussis} onChange={v => updateDate('pertussis', v)} />
                            </div>
                        </VaccineCard>

                        <div className="mt-4 flex flex-col gap-4">
                            <BTStatusBadge type="success" message={success} />
                            <BTStatusBadge type="error" message={error} />
                            <BTPrimaryButton title="Save Records" icon={Save} loading={saving} onClick={handleSave} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const VaccineCard = ({ title, icon: Icon, color, desc, children }) => (
    <BTCard className="p-6 border border-bt-border">
        <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
                <Icon size={24} color={color} />
            </div>
            <div>
                <h3 className="bt-headline">{title}</h3>
                <p className="bt-caption text-bt-text-second">{desc}</p>
            </div>
        </div>
        {children}
    </BTCard>
);

const DateRow = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between gap-4">
        <span className="bt-caption font-semibold text-bt-text-primary">{label}</span>
        <div className="flex items-center gap-2 bg-bt-surface2 px-4 py-2 rounded-xl border border-bt-border">
            <Calendar size={14} className="text-bt-text-tertiary" />
            <input
                type="text"
                placeholder="DD/MM/YYYY"
                value={value}
                onChange={e => onChange(e.target.value)}
                className="bg-transparent border-none outline-none bt-caption w-24 text-bt-primary font-bold placeholder:text-bt-text-tertiary placeholder:font-normal"
            />
        </div>
    </div>
);

export default Vaccination;
