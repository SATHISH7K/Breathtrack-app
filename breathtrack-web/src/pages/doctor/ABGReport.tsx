import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Camera, Send, Loader2,
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { apiCall } from '../../api/apiService';
import './PftValues.css'; // Reusing PFT styles as they are essentially identical

const ABGReport: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [severity, setSeverity] = useState<string>('Normal');
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
        setIsSubmitting(true);
        try {
            const base64Image = selectedImage ? selectedImage.split(',')[1] : '';
            const payload = {
                patient_id: id,
                image: base64Image,
                comments,
                normal: severity === 'Normal' ? 'Yes' : 'No',
                mild: severity === 'Mild' ? 'Yes' : 'No',
                moderate: severity === 'Moderate' ? 'Yes' : 'No',
                severe: severity === 'Severe' ? 'Yes' : 'No'
            };

            const res = await apiCall('submit_abg.php', 'POST', payload);
            if (res.status === 'success') {
                alert('ABG Report Submitted Successfully!');
                navigate(`/doctor/patients/${id}`);
            } else {
                alert('Error: ' + res.message);
            }
        } catch (err) {
            console.error('Submission failed', err);
            alert('Failed to submit report.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pft-container">
            <header className="pft-header">
                <button className="pft-back-btn" onClick={() => navigate(`/doctor/patients/${id}`)}>
                    <ChevronLeft size={20} />
                </button>
                <h1>ABG Report Entry</h1>
                <div style={{ width: 40 }} />
            </header>

            <div className="pft-content">
                <section className="pft-section">
                    <h3 className="section-title">Medical Report Document</h3>
                    <div className="pft-upload-card">
                        <input type="file" id="abg-image" accept="image/*" onChange={handleImageChange} hidden />
                        <label htmlFor="abg-image" className="pft-upload-label">
                            {selectedImage ? (
                                <img src={selectedImage} alt="ABG Report" className="pft-preview" />
                            ) : (
                                <div className="pft-upload-placeholder">
                                    <div className="pft-upload-icon">
                                        <FileText size={24} />
                                    </div>
                                    <span className="pft-upload-text">Upload Report Image</span>
                                    <span className="pft-upload-subtext">Capture or select from gallery</span>
                                </div>
                            )}
                        </label>
                    </div>
                </section>

                <section className="pft-section">
                    <h3 className="section-title">ABG Severity Level</h3>
                    <div className="pft-severity-list horizontal">
                        <div className="pft-segmented-control">
                            {['Normal', 'Mild', 'Moderate', 'Severe'].map((level) => (
                                <button
                                    key={level}
                                    className={`pft-segment ${severity === level ? 'active' : ''}`}
                                    onClick={() => setSeverity(level)}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="pft-section">
                    <h3 className="section-title">Physician Remarks</h3>
                    <textarea
                        className="pft-comments"
                        placeholder="Enter additional clinical observations..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                    />
                </section>

                <button
                    className="pft-submit-btn btn-press"
                    disabled={isSubmitting}
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
                            <span>Submit ABG Report</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ABGReport;
