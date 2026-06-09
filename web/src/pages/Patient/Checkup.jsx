import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Thermometer, ArrowRight, Minus, Plus } from 'lucide-react';
import { BTBackButton, BTPrimaryButton } from '../../components/BTComponents';

const Checkup = () => {
    const navigate = useNavigate();
    const [temperature, setTemperature] = useState(98);
    const [appeared, setAppeared] = useState(false);

    useEffect(() => {
        setAppeared(true);
    }, []);

    const statusText = temperature < 97 ? "Below Normal" :
        temperature <= 99 ? "Normal Range" :
            temperature <= 100 ? "Slight Fever" : "High Fever";

    const statusColor = temperature < 97 ? "var(--bt-primary)" :
        temperature <= 99 ? "var(--bt-accent-green)" :
            temperature <= 100 ? "var(--bt-accent-orange)" : "var(--bt-accent)";

    return (
        <div className="page-container flex flex-col bg-bt-background">
            <div className="page-header justify-between bg-bt-background">
                <BTBackButton onClick={() => navigate('/patient')} />
                <h1 className="bt-headline">Health Checkup</h1>
                <div className="w-10" />
            </div>

            <div className="page-content flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: appeared ? 1 : 0, scale: appeared ? 1 : 0.8 }}
                    className="mt-10 flex flex-col items-center text-center"
                >
                    <div className="w-[90px] h-[90px] bg-bt-primary/10 rounded-full flex items-center justify-center mb-6">
                        <Thermometer size={40} className="text-bt-primary" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className="bt-title2">Body Temperature</h2>
                        <p className="bt-body-small text-bt-text-second px-10">
                            Adjust to match your current thermometer reading.
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
                            {temperature}
                        </span>
                        <span className="bt-title text-bt-text-second">°F</span>
                    </div>

                    <div className="flex gap-10">
                        <StepperButton icon={Minus} onClick={() => temperature > 90 && setTemperature(v => v - 1)} />
                        <StepperButton icon={Plus} onClick={() => temperature < 110 && setTemperature(v => v + 1)} />
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
                    <BTPrimaryButton
                        title="Continue to Oxygen Check"
                        icon={ArrowRight}
                        onClick={() => navigate('/patient/oxygen', { state: { temperature } })}
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

export default Checkup;
