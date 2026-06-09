import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wind, CheckCircle2, Minus, Plus } from 'lucide-react';
import { BTBackButton, BTPrimaryButton, BTStatusBadge } from '../../components/BTComponents';
import { useAuth } from '../../context/AuthContext';
import APIConfig from '../../config';

const LungCheck = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { temperature, spo2 } = location.state || { temperature: 98, spo2: 98 };

    const [value, setValue] = useState(100);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [appeared, setAppeared] = useState(false);

    useEffect(() => {
        setAppeared(true);
    }, []);

    const statusText = value >= 80 ? "Green Zone (Good)" :
        value >= 50 ? "Yellow Zone (Caution)" : "Red Zone (Alert!)";

    const statusColor = value >= 80 ? "var(--bt-accent-green)" :
        value >= 50 ? "var(--bt-accent-orange)" : "var(--bt-accent)";

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            const payload = {
                patient_id: user.patient_id,
                temperature: temperature,
                oxygen_level: spo2,
                lung_function: value
            };

            const response = await fetch(APIConfig.getURL('save_checkup.php'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            // Backend might return status: 'success'
            if (data.status === 'success' || data.success) {
                setSuccess(true);
                setTimeout(() => navigate('/patient'), 1500);
            } else {
                setError(data.message || 'Submission failed');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="page-container flex flex-col items-center justify-center p-10 text-center bg-bt-background">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <CheckCircle2 size={80} className="text-bt-accent-green mb-6 mx-auto" />
                    <h2 className="bt-title2 mb-2">Success</h2>
                    <p className="bt-body text-bt-text-second">Medical Checkup Taken Successfully!</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="page-container flex flex-col bg-bt-background">
            <div className="page-header justify-between bg-bt-background">
                <BTBackButton onClick={() => navigate(-1)} />
                <h1 className="bt-headline">Lung Check</h1>
                <div className="w-10" />
            </div>

            <div className="page-content flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: appeared ? 1 : 0, scale: appeared ? 1 : 0.8 }}
                    className="mt-10 flex flex-col items-center text-center"
                >
                    <div className="w-[90px] h-[90px] bg-bt-primary/10 rounded-full flex items-center justify-center mb-6">
                        <Wind size={40} className="text-bt-primary" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className="bt-title2">Lung Function</h2>
                        <p className="bt-body-small text-bt-text-second px-10">
                            Measure your Peak Expiratory Flow (PEF) using your device.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: appeared ? 1 : 0, y: appeared ? 0 : 20 }}
                    className="w-full mt-10 p-10 bg-white rounded-[32px] shadow-card flex flex-col items-center gap-8 border border-bt-border/50"
                >
                    <div className="flex items-baseline gap-1">
                        <span className="text-[72px] font-bold text-bt-text-primary tracking-tighter">
                            {value}
                        </span>
                        <span className="bt-title text-bt-text-second">%</span>
                    </div>

                    <div className="flex gap-10">
                        <StepperButton icon={Minus} onClick={() => value > 0 && setValue(v => v - 1)} />
                        <StepperButton icon={Plus} onClick={() => value < 100 && setValue(v => v + 1)} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: appeared ? 1 : 0 }}
                    className="mt-8 px-5 py-2 rounded-full flex items-center gap-2"
                    style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
                >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
                    <span className="bt-headline text-[13px]">{statusText}</span>
                </motion.div>

                <div className="mt-auto w-full pt-10">
                    <BTStatusBadge type="error" message={error} />
                    <BTPrimaryButton
                        title="Complete Checkup"
                        icon={CheckCircle2}
                        loading={loading}
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

const StepperButton = ({ icon: Icon, onClick }) => (
    <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className="w-16 h-16 rounded-full bg-bt-primary-gradient flex items-center justify-center text-white border-none shadow-lg shadow-bt-primary/40 cursor-pointer"
    >
        <Icon size={24} strokeWidth={3} />
    </motion.button>
);

export default LungCheck;
