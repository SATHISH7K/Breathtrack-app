import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, CheckCircle2, ChevronRight, ChevronLeft,
    Wind, MessageCircle, Heart, Thermometer, ShieldCheck,
    Info, HelpCircle, Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import APIConfig from '../../config';

const questionsData = [
    {
        index: 1,
        titleEN: "I never Cough",
        titleTA: "எனக்கு ஒரு போதும் இருமல் வராது",
        footerEN: "I Cough all times",
        footerTA: "எனக்கு எப்போதும் இருமல் வருகிறது",
        key: 'q1_cough',
        icon: Wind
    },
    {
        index: 2,
        titleEN: "I have no phlegm in my chest",
        titleTA: "எனக்கு மார்பில் சளி எதுவும் இல்லை",
        footerEN: "My Chest is full of phlegm",
        footerTA: "என் மார்பு முழுவதும் சளியால் நிரம்புள்ளது",
        key: 'q2_phlegm',
        icon: MessageCircle
    },
    {
        index: 3,
        titleEN: "My Chest doesn't feel tight",
        titleTA: "என் மார்பு ஒருபோதும் இறுக்கமாக உணரவில்லை",
        footerEN: "My Chest feels very tight",
        footerTA: "என் மார்பு மிகவும் இறுக்கமாக உணரப்படுகிறது",
        key: 'q3_chest_tightness',
        icon: ShieldCheck
    },
    {
        index: 4,
        titleEN: "I have lots of energy",
        titleTA: "எனக்கு மிகவும் அதிக சக்தி உள்ளது",
        footerEN: "I have no energy at all",
        footerTA: "எனக்கு ஒருபோதும் சக்தி இல்லை",
        key: 'q4_breathlessness',
        icon: Activity
    },
    {
        index: 5,
        titleEN: "I sleep soundly",
        titleTA: "நான் நிம்மதியாக தூங்குகிறேன்",
        footerEN: "I do not sleep well at all",
        footerTA: "நான் ஒருபோதும் நிம்மதியாக தூங்கவில்லை",
        key: 'q5_activity_limitation',
        icon: Heart
    },
    {
        index: 6,
        titleEN: "I am confident leaving home",
        titleTA: "நான் வீட்டை விட்டு வெளியே செல்ல நம்பிக்கையுடன் இருக்கிறேன்",
        footerEN: "I am not confident leaving home",
        footerTA: "வீட்டை விட்டு வெளியே செல்ல நம்பிக்கையுடன் இல்லை",
        key: 'q6_confidence_leaving_home',
        icon: HelpCircle
    },
    {
        index: 7,
        titleEN: "I feel comfortable outdoors",
        titleTA: "எனக்கு வெளிப்புற செயல்பாடுகள் செய்ய வசதியாக உள்ளது",
        footerEN: "Outdoor activities are not comfortable",
        footerTA: "வெளிப்புற செயல்பாடுகள் வசதியாக இல்லை",
        key: 'q7_sleep_quality',
        icon: Thermometer
    },
    {
        index: 8,
        titleEN: "I can climb stairs easily",
        titleTA: "நான் படிக்கட்டுகளை சிரமமின்றி ஏற முடியும்",
        footerEN: "I cannot climb stairs at all",
        footerTA: "நான் படிக்கட்டுகளை ஏற முடியாது",
        key: 'q8_energy_level',
        icon: Activity
    }
];

const Questionnaires = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const currentQuestion = questionsData[currentIdx];
    const progress = ((currentIdx + (answers[currentQuestion.key] !== undefined ? 1 : 0)) / questionsData.length);

    const selectValue = (val) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.key]: val }));
    };

    const handleNext = () => {
        if (currentIdx < questionsData.length - 1) {
            setCurrentIdx(currentIdx + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentIdx > 0) {
            setCurrentIdx(currentIdx - 1);
        } else {
            navigate('/patient');
        }
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < questionsData.length) {
            setError('Please answer all questions before submitting.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const payload = {
                patient_id: user.patient_id,
                ...answers
            };

            const response = await fetch(APIConfig.getURL('save_questionnaire.php'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (data.status === 'success' || data.success) {
                setSuccess(true);
                setTimeout(() => navigate('/patient'), 2000);
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
            <div className="page-container flex flex-col items-center justify-center p-12 text-center bg-[#F8F9FE]">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-[#34C759]/10 rounded-full flex items-center justify-center mb-8">
                        <CheckCircle2 size={56} className="text-[#34C759]" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#1C1C1E] mb-3">Assessment Complete</h1>
                    <p className="text-[#8E8E93] text-lg max-w-xs mx-auto">Your health status has been successfully recorded.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="page-container flex flex-col bg-[#F8F9FE] min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-[#E5E5EA] pt-14 pb-4 px-6 flex items-center justify-between">
                <button onClick={handleBack} className="w-10 h-10 rounded-xl bg-[#F2F2F7] flex items-center justify-center text-[#1C1C1E] shadow-sm active:scale-95 transition-all">
                    <ArrowLeft size={18} strokeWidth={2.5} />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest mb-0.5">CAT Assessment</span>
                    <span className="text-[17px] font-extrabold text-[#1C1C1E]">Symptom Check</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#5B4CF5]/10 flex items-center justify-center text-[#5B4CF5] font-bold text-xs ring-1 ring-[#5B4CF5]/20">
                    {currentIdx + 1}/{questionsData.length}
                </div>
            </div>

            {/* Progress Bar Area */}
            <div className="px-6 pt-6 pb-2">
                <div className="h-2 w-full bg-[#E5E5EA] rounded-full overflow-hidden mb-2">
                    <motion.div
                        className="h-full bg-linear-to-r from-[#5B4CF5] to-[#857AF7]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress * 100}%` }}
                        transition={{ spring: { damping: 20, stiffness: 100 } }}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pt-4 pb-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIdx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-8"
                    >
                        {/* Question Icon & Text */}
                        <div className="flex flex-col items-center text-center mt-4">
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-deep flex items-center justify-center mb-8 text-[#5B4CF5]">
                                {React.createElement(currentQuestion.icon, { size: 40, strokeWidth: 1.5 })}
                            </div>
                            <h2 className="text-[26px] font-extrabold text-[#1C1C1E] leading-tight mb-2 px-4 italic">
                                "{currentQuestion.titleEN}"
                            </h2>
                            <p className="text-[15px] font-medium text-[#5B4CF5] leading-relaxed mb-10 px-6 opacity-80">
                                {currentQuestion.titleTA}
                            </p>
                        </div>

                        {/* Likert Scale (0-5) */}
                        <div className="bg-white rounded-[32px] p-8 shadow-card border border-[#E5E5EA]/50">
                            <div className="flex justify-between items-center gap-2 mb-10">
                                {[0, 1, 2, 3, 4, 5].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => selectValue(val)}
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black transition-all ring-offset-2 ${answers[currentQuestion.key] === val
                                                ? 'bg-[#5B4CF5] text-white shadow-lg shadow-[#5B4CF5]/40 ring-2 ring-[#5B4CF5] scale-110'
                                                : 'bg-[#F2F2F7] text-[#8E8E93] hover:bg-[#E5E5EA]'
                                            }`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between gap-4">
                                <div className="flex-1">
                                    <p className="text-[11px] font-bold text-[#8E8E93] uppercase mb-1">{currentQuestion.titleEN}</p>
                                    <p className="text-[10px] text-[#C7C7CC] font-medium leading-relaxed">{currentQuestion.titleTA}</p>
                                </div>
                                <div className="text-right flex-1">
                                    <p className="text-[11px] font-bold text-[#8E8E93] uppercase mb-1">{currentQuestion.footerEN}</p>
                                    <p className="text-[10px] text-[#C7C7CC] font-medium leading-relaxed">{currentQuestion.footerTA}</p>
                                </div>
                            </div>
                        </div>

                        {/* Info Tooltip */}
                        <div className="flex items-start gap-4 p-5 bg-[#5B4CF5]/5 rounded-3xl border border-[#5B4CF5]/10">
                            <Info size={20} className="text-[#5B4CF5] mt-0.5 flex-shrink-0" />
                            <p className="text-[13px] text-[#3A3A3C] leading-relaxed">
                                Please select a number from <span className="font-bold text-[#5B4CF5]">0 to 5</span> that best describes your current state.
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/60 backdrop-blur-2xl border-t border-[#E5E5EA]">
                <div className="max-w-[480px] mx-auto w-full flex gap-4">
                    <button
                        onClick={handleBack}
                        className="flex-1 h-[60px] rounded-2xl border-2 border-[#E5E5EA] text-[#3A3A3C] font-extrabold flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                        <ChevronLeft size={20} />
                        Back
                    </button>
                    <button
                        disabled={answers[currentQuestion.key] === undefined || loading}
                        onClick={handleNext}
                        className={`flex-[2] h-[60px] rounded-2xl font-extrabold flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all ${answers[currentQuestion.key] === undefined || loading
                                ? 'bg-[#E5E5EA] text-[#8E8E93] cursor-not-allowed shadow-none'
                                : 'bg-linear-to-r from-[#5B4CF5] to-[#857AF7] text-white shadow-[#5B4CF5]/20'
                            }`}
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                {currentIdx === questionsData.length - 1 ? 'Finish Assessment' : 'Next Question'}
                                <ChevronRight size={20} />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {error && (
                <div className="fixed top-24 left-6 right-6 z-50">
                    <BTStatusBadge type="error" message={error} />
                </div>
            )}
        </div>
    );
};

export default Questionnaires;
