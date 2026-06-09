import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, UserCheck, ShieldCheck, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import {
    BTBackButton,
    BTInputField,
    BTPrimaryButton,
    BTStatusBadge
} from '../../components/BTComponents';
import APIConfig from '../../config';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [patientId, setPatientId] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [statusType, setStatusType] = useState('error');

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!patientId) {
            setError('Please enter your Patient ID');
            setStatusType('warning');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('patient_id', patientId);

            const response = await fetch(APIConfig.getURL('verify_patient.php'), {
                method: 'POST',
                // Note: The PHP backend might expect JSON or FormData. 
                // In the Swift code it uses JSON for verify_patient.php, 
                // but in patient_login.php it uses JSON too. 
                // Let's check verify_patient.php content to be sure.
                body: JSON.stringify({ patient_id: patientId }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (data.status === 'success') {
                setIsVerified(true);
                setError('Patient ID verified successfully!');
                setStatusType('success');
            } else {
                setError(data.message || 'Patient ID not found');
                setStatusType('error');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
            setStatusType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        if (!newPassword || !confirmPassword) {
            setError('All fields are required');
            setStatusType('warning');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setStatusType('error');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(APIConfig.getURL('patient_forgot_password.php'), {
                method: 'POST',
                body: JSON.stringify({
                    patient_id: patientId,
                    new_password: newPassword
                }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (data.status === 'success') {
                setSuccess(true);
                setError('Password Reset Successfully!');
                setStatusType('success');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(data.message || 'Failed to reset password');
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
                        {isVerified ? (
                            <ShieldCheck size={40} className="text-bt-primary" />
                        ) : (
                            <Lock size={40} className="text-bt-primary" />
                        )}
                    </div>
                    <h1 className="bt-title text-bt-text-primary mb-2">Reset Password</h1>
                    <p className="bt-body text-bt-text-second px-4">
                        {isVerified
                            ? "ID Verified! Set your new password."
                            : "Enter your Patient ID to verify your identity."}
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!isVerified ? (
                        <motion.form
                            key="verify-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleVerify}
                            className="flex flex-col gap-6"
                        >
                            <BTInputField
                                placeholder="Patient ID (pat_xxx)"
                                value={patientId}
                                onChange={setPatientId}
                                icon={Mail}
                            />

                            <BTStatusBadge type={statusType} message={error} />

                            <BTPrimaryButton
                                title="Verify Patient ID"
                                icon={ArrowRight}
                                loading={loading}
                                type="submit"
                            />
                        </motion.form>
                    ) : (
                        <motion.form
                            key="reset-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onSubmit={handleReset}
                            className="flex flex-col gap-6"
                        >
                            <div className="flex flex-col gap-4">
                                <BTInputField
                                    placeholder="New Password"
                                    type="password"
                                    value={newPassword}
                                    onChange={setNewPassword}
                                    icon={Lock}
                                />
                                <BTInputField
                                    placeholder="Confirm New Password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={setConfirmPassword}
                                    icon={ShieldCheck}
                                />
                            </div>

                            <BTStatusBadge type={statusType} message={error} />

                            <BTPrimaryButton
                                title="Reset Password"
                                icon={CheckCircle2}
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

export default ForgotPassword;
