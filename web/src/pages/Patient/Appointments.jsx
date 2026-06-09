import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Phone, User, Activity, CheckCircle2, ChevronRight, Stethoscope } from 'lucide-react';
import { BTBackButton, BTInputField, BTPrimaryButton, BTStatusBadge, BTCard } from '../../components/BTComponents';
import { useAuth } from '../../context/AuthContext';
import APIConfig from '../../config';

const Appointments = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: user?.name || '',
        age: user?.age || '',
        gender: user?.gender || 'Male',
        contact: '',
        email: user?.email || '',
        address: '',
        copd_confirmed: 'yes',
        duration_symptoms: '',
        symptoms: [],
        medications: '',
        allergies: '',
        smoking_status: 'Never Smoked',
        preferred_date: '',
        preferred_time: 'Morning',
        consultation_mode: 'In-Person'
    });

    const symptomOptions = ["Shortness of breath", "Chronic cough", "Phlegm production", "Chest tightness", "Fatigue", "Wheezing"];

    const toggleSymptom = (s) => {
        setFormData(prev => ({
            ...prev,
            symptoms: prev.symptoms.includes(s)
                ? prev.symptoms.filter(item => item !== s)
                : [...prev.symptoms, s]
        }));
    };

    const updateField = (f, v) => setFormData(prev => ({ ...prev, [f]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.contact || !formData.preferred_date) {
            setError('Please fill required fields (Contact & Date)');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'symptoms') {
                    data.append(key, formData[key].join(','));
                } else {
                    data.append(key, formData[key]);
                }
            });
            data.append('patient_id', user.patient_id);

            const response = await fetch(APIConfig.getURL('submit_appointment.php'), {
                method: 'POST',
                body: data,
            });

            const res = await response.json();
            if (res.status === 'success') {
                setSuccess(true);
                setTimeout(() => navigate('/patient'), 2500);
            } else {
                setError(res.message || 'Booking failed');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="page-container flex flex-col items-center justify-center p-10 text-center">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <div className="w-24 h-24 bg-bt-accent-green/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <CheckCircle2 size={50} className="text-bt-accent-green" />
                    </div>
                    <h2 className="bt-title mb-2">Request Sent!</h2>
                    <p className="bt-body text-bt-text-second">Your appointment request has been sent to the doctor. We'll notify you once it's confirmed.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="page-container flex flex-col pb-12">
            <div className="page-header justify-between bg-white border-b border-bt-border">
                <BTBackButton onClick={() => navigate('/patient')} />
                <h1 className="page-title">Book Appointment</h1>
                <div className="w-11" />
            </div>

            <div className="page-content pt-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-10">

                    <Section title="Personal Details" icon={User}>
                        <BTInputField placeholder="Full Name" value={formData.name} onChange={v => updateField('name', v)} icon={User} />
                        <div className="form-row">
                            <BTInputField placeholder="Age" value={formData.age} onChange={v => updateField('age', v)} type="number" />
                            <div className="bt-input-wrapper">
                                <select value={formData.gender} onChange={e => updateField('gender', e.target.value)}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <BTInputField placeholder="Contact Number" value={formData.contact} onChange={v => updateField('contact', v)} icon={Phone} type="tel" />
                        <BTInputField placeholder="Residential Address" value={formData.address} onChange={v => updateField('address', v)} icon={MapPin} />
                    </Section>

                    <Section title="Medical Info" icon={Stethoscope}>
                        <div className="flex flex-col gap-3">
                            <p className="bt-caption font-semibold">Current Symptoms</p>
                            <div className="flex flex-wrap gap-2">
                                {symptomOptions.map(s => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => toggleSymptom(s)}
                                        className={`selectable-chip ${formData.symptoms.includes(s) ? 'selected' : ''}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <BTInputField placeholder="Current Medications" value={formData.medications} onChange={v => updateField('medications', v)} icon={Activity} />
                    </Section>

                    <Section title="Preferred Slot" icon={Calendar}>
                        <div className="flex flex-col gap-4">
                            <div className="bt-input-wrapper">
                                <Calendar size={18} className="text-bt-text-second mr-2" />
                                <input type="date" value={formData.preferred_date} onChange={e => updateField('preferred_date', e.target.value)} />
                            </div>
                            <div className="segmented-picker">
                                {['Morning', 'Afternoon', 'Evening'].map(time => (
                                    <button
                                        key={time}
                                        className={formData.preferred_time === time ? 'active' : ''}
                                        onClick={() => updateField('preferred_time', time)}
                                        type="button"
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                            <div className="bt-input-wrapper">
                                <select value={formData.consultation_mode} onChange={e => updateField('consultation_mode', e.target.value)}>
                                    <option value="In-Person">In-Person Consultation</option>
                                    <option value="Video Call">Video Call</option>
                                </select>
                            </div>
                        </div>
                    </Section>

                    <div className="sticky bottom-4">
                        <BTStatusBadge type="error" message={error} />
                        <BTPrimaryButton title="Confirm Appointment" icon={ChevronRight} loading={loading} type="submit" />
                    </div>
                </form>
            </div>
        </div>
    );
};

const Section = ({ title, icon: Icon, children }) => (
    <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
            <Icon size={18} className="text-bt-primary" />
            <h3 className="bt-headline text-bt-primary text-xs uppercase tracking-wider">{title}</h3>
        </div>
        <div className="flex flex-col gap-4">
            {children}
        </div>
    </div>
);

export default Appointments;
