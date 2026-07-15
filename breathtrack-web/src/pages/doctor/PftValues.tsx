import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Camera, CheckCircle2, AlertCircle,
    AlertTriangle, Octagon, Send, Loader2
} from 'lucide-react';
import { apiCall } from '../../api/apiService';
import './PftValues.css';

type Severity = 'normal' | 'mild' | 'moderate' | 'severe' | null;

const PftValues: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [severity, setSeverity] = useState<Severity>(null);
    const [comments, setComments] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!severity) return;
        setIsSubmitting(true);

        try {
            // Extract base64 part
            const base64Image = selectedImage ? selectedImage.split(',')[1] : '';

            const payload = {
                patient_id: id,
                normal: severity === 'normal' ? 'Yes' : 'No',
                mild: severity === 'mild' ? 'Yes' : 'No',
                moderate: severity === 'moderate' ? 'Yes' : 'No',
                severe: severity === 'severe' ? 'Yes' : 'No',
                comments,
                image: base64Image
            };

            const res = await apiCall('submit_pft.php', 'POST', payload);
            if (res.status === 'success') {
                alert('PFT Report Submitted Successfully!');
                navigate(`/doctor/patients/${id}`);
            } else {
                alert('Error: ' + res.message);
            }
        } catch (err) {
            console.error('Submission failed', err);
            alert('Failed to submit report. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const severityOptions = [
        { id: 'normal', label: 'Normal', icon: <CheckCircle2 size={20} />, color: '#34C98A' },
        { id: 'mild', label: 'Mild', icon: <AlertCircle size={20} />, color: '#7B6CF6' },
        { id: 'moderate', label: 'Moderate', icon: <AlertTriangle size={20} />, color: '#FF9B42' },
        { id: 'severe', label: 'Severe', icon: <Octagon size={20} />, color: '#FF6B6B' }
    ];

    return (
        <div className="pft-container">
            <header className="pft-header">
                <button className="pft-back-btn" onClick={() => navigate(`/doctor/patients/${id}`)}>
                    <ChevronLeft size={20} />
                </button>
                <h1>PFT Report Entry</h1>
                <div style={{ width: 40 }} />
            </header>

            <div className="pft-content">
                <section className="pft-section">
                    <h3 className="section-title">PFT Lab Results</h3>
                    <div className="pft-upload-card">
                        <input
                            type="file"
                            id="pft-image"
                            accept="image/*"
                            onChange={handleImageChange}
                            hidden
                        />
                        <label htmlFor="pft-image" className="pft-upload-label">
                            {selectedImage ? (
                                <img src={selectedImage} alt="PFT Report" className="pft-preview" />
                            ) : (
                                <div className="pft-upload-placeholder">
                                    <div className="pft-upload-icon">
                                        <Camera size={24} />
                                    </div>
                                    <span className="pft-upload-text">Upload Report Image</span>
                                    <span className="pft-upload-subtext">Document capture or upload</span>
                                </div>
                            )}
                        </label>
                    </div>
                </section>

                <section className="pft-section">
                    <h3 className="section-title">Clinical Severity Assessment</h3>
                    <div className="pft-severity-list">
                        {severityOptions.map((opt) => (
                            <div key={opt.id} className="pft-severity-row">
                                <div className="pft-severity-info">
                                    <span style={{ color: opt.color }}>{opt.icon}</span>
                                    <span className="pft-severity-label">{opt.label}</span>
                                </div>
                                <div className="pft-chips">
                                    <button
                                        className={`pft-chip ${severity === opt.id ? 'active' : ''}`}
                                        style={severity === opt.id ? { backgroundColor: opt.color } : {}}
                                        onClick={() => setSeverity(opt.id as Severity)}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className={`pft-chip ${severity !== opt.id && severity !== null ? 'active-no' : ''}`}
                                        onClick={() => severity === opt.id ? setSeverity(null) : null}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="pft-section">
                    <h3 className="section-title">Additional Notes</h3>
                    <textarea
                        className="pft-comments"
                        placeholder="Enter details regarding PFT findings..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                    />
                </section>

                <button
                    className="pft-submit-btn btn-press"
                    disabled={!severity || isSubmitting}
                    onClick={handleSubmit}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={20} className="spinner" />
                            <span>Submitting...</span>
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            <span>Submit PFT Report</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default PftValues;
