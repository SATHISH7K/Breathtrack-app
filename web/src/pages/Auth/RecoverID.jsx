import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Search, UserCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import {
    BTBackButton,
    BTInputField,
    BTPrimaryButton,
    BTStatusBadge
} from '../../components/BTComponents';
import APIConfig from '../../config';

const RecoverId = () => {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [recoveredId, setRecoveredId] = useState(null);
    const [error, setError] = useState('');
    const [statusType, setStatusType] = useState('error');

    const handleRecover = async (e) => {
        e.preventDefault();
        if (!phoneNumber) {
            setError('Please enter your Phone Number');
            setStatusType('warning');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(APIConfig.getURL('recover_patient_id.php'), {
                method: 'POST',
                body: JSON.stringify({ phone_number: phoneNumber }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (data.status === 'success' && data.patient_id) {
                setRecoveredId(data.patient_id);
                setError('ID Recovered Successfully!');
                setStatusType('success');
            } else {
                setError(data.message || 'No account found with this phone number');
                setStatusType('error');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
            setStatusType('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container flex flex-col">
            <div className="page-header justify-start">
                <BTBackButton onClick={() => navigate('/login')} />
            </div>

            <div className="page-content flex flex-col flex-grow">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 mb-8 text-center"
                >
                    <div className="w-20 h-20 bg-bt-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <UserCheck size={40} className="text-bt-primary" />
                    </div>
                    <h1 className="bt-title text-bt-text-primary mb-2">Recover Patient ID</h1>
                    <p className="bt-body text-bt-text-second px-4">
                        {recoveredId
                            ? "We found your Patient ID!"
                            : "Enter your registered Phone Number to recover your ID."}
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {recoveredId ? (
                        <motion.div
                            key="recovered"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col gap-8"
                        >
                            <div className="bg-bt-primary/5 border-2 border-bt-primary/20 rounded-[32px] p-10 text-center shadow-inner">
                                <span className="bt-caption2 text-bt-primary mb-2 block">YOUR PATIENT ID</span>
                                <h1 className="text-4xl font-bold text-bt-primary tracking-wider">{recoveredId}</h1>
                            </div>

                            <p className="bt-body text-bt-text-second text-center px-4">
                                You can now safely return to the login screen and use this ID to sign in.
                            </p>

                            <BTPrimaryButton
                                title="Back to Login"
                                icon={ArrowLeft}
                                onClick={() => navigate('/login')}
                            />
                        </motion.div>
                    ) : (
                        <motion.form
                            key="recover-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onSubmit={handleRecover}
                            className="flex flex-col gap-6"
                        >
                            <BTInputField
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChange={setPhoneNumber}
                                icon={Phone}
                                type="tel"
                            />

                            <BTStatusBadge type={statusType} message={error} />

                            <BTPrimaryButton
                                title="Find My ID"
                                icon={Search}
                                loading={loading}
                                type="submit"
                            />
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RecoverId;
