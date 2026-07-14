import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, Calendar, ChevronLeft, Phone, Ruler, Scale, Activity, HeartPulse, CheckCircle, Briefcase } from 'lucide-react';
import { apiCall } from '../../api/apiService';
import BTInputField from '../../components/BTInputField';
import BTPrimaryButton from '../../components/BTPrimaryButton';
import './Login.css';

const PatientSignup: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'Male',
        occupation: '',
        phone_number: '',
        height: '',
        weight: '',
        diagnosis: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successId, setSuccessId] = useState('');

    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        const result = await apiCall('patient_signup.php', 'POST', {
            name: formData.name,
            age: formData.age,
            gender: formData.gender,
            occupation: formData.occupation,
            phone_number: formData.phone_number,
            height: formData.height,
            weight: formData.weight,
            diagnosis: formData.diagnosis,
            password: formData.password
        });

        if (result.status === 'success') {
            setSuccessId(result.patient_id);
            setLoading(false);
        } else {
            setError(result.message || 'Signup failed');
            setLoading(false);
        }
    };

    if (successId) {
        return (
            <div className="login-page-web">
                <div className="login-form-side" style={{ flex: 1 }}>
                    <div className="login-card-web success-card">
                        <div className="success-icon-animation">
                            <CheckCircle size={80} color="#34C98A" />
                        </div>
                        <h1>Account Created!</h1>
                        <p>Your unique Patient ID is your key to BreathTrack.</p>

                        <div className="id-reveal-box">
                            <span className="id-label">YOUR PATIENT ID</span>
                            <div className="id-value">{successId}</div>
                        </div>

                        <p className="id-note">Please save this ID safely. You will need it to log in next time.</p>

                        <BTPrimaryButton onClick={() => navigate('/patient/login')} className="login-btn-web">
                            Go to Login
                        </BTPrimaryButton>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page-web">
            <div className="login-side-banner">
                <div className="banner-content">
                    <div className="banner-logo">
                        <HeartPulse size={40} color="white" />
                        <span>BreathTrack</span>
                    </div>
                    <h1>Start Your Journey to Better Breathing.</h1>
                    <p>Join thousands of patients managing their health effectively with professional tools and doctor connectivity.</p>
                </div>
                <div className="banner-overlay"></div>
            </div>

            <div className="login-form-side signup-side">
                <div className="login-card-web signup-card">
                    <header className="login-header-web">
                        <Link to="/patient/login" className="back-link-web">
                            <ChevronLeft size={16} /> Back to Login
                        </Link>
                        <h2>Create Account</h2>
                        <p>Join the BreathTrack community today</p>
                    </header>

                    <form onSubmit={handleSignup} className="login-form-web signup-form-grid">
                        <div className="form-group-web full-width">
                            <label>Full Name</label>
                            <BTInputField icon={<User size={18} />} placeholder="Enter your full name" value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>

                        <div className="form-group-web">
                            <label>Age</label>
                            <BTInputField icon={<Calendar size={18} />} placeholder="Age" type="number" value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                        </div>

                        <div className="form-group-web">
                            <label>Gender</label>
                            <div className="bt-input-container">
                                <select className="bt-input-wrapper select-field" value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                    <option>Male</option><option>Female</option><option>Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group-web">
                            <label>Height (cm)</label>
                            <BTInputField icon={<Ruler size={18} />} placeholder="175" type="number" value={formData.height}
                                onChange={(e) => setFormData({ ...formData, height: e.target.value })} />
                        </div>

                        <div className="form-group-web">
                            <label>Weight (kg)</label>
                            <BTInputField icon={<Scale size={18} />} placeholder="70" type="number" value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
                        </div>

                        <div className="form-group-web full-width">
                            <label>Phone Number</label>
                            <BTInputField icon={<Phone size={18} />} placeholder="+1 (555) 000-0000" value={formData.phone_number}
                                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} />
                        </div>

                        <div className="form-group-web full-width">
                            <label>Occupation</label>
                            <BTInputField icon={<Briefcase size={18} />} placeholder="e.g. Teacher, Nurse" value={formData.occupation}
                                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} />
                        </div>

                        <div className="form-group-web full-width">
                            <label>Diagnosis</label>
                            <BTInputField icon={<Activity size={18} />} placeholder="e.g. COPD, Asthma" value={formData.diagnosis}
                                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })} />
                        </div>

                        <div className="form-group-web">
                            <label>Password</label>
                            <BTInputField icon={<Lock size={18} />} type="password" placeholder="••••••••" value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                        </div>

                        <div className="form-group-web">
                            <label>Confirm Password</label>
                            <BTInputField icon={<Lock size={18} />} type="password" placeholder="••••••••" value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                        </div>

                        {error && <div className="error-alert full-width">{error}</div>}

                        <BTPrimaryButton type="submit" loading={loading} icon={<ArrowRight size={20} />} className="login-btn-web full-width">
                            Register & Get My ID
                        </BTPrimaryButton>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PatientSignup;
