import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Activity, Send, Loader2,
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { apiCall } from '../../api/apiService';
import './SixMinWalkTest.css';

const SixMinWalkTest: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!description.trim()) {
            alert('Please enter the report description.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await apiCall('submit_six_min_walk.php', 'POST', {
                patient_id: id,
                description: description
            });

            if (res.status === 'success') {
                alert('6 Min Walk Test report saved successfully!');
                navigate(`/doctor/patients/${id}`);
            } else {
                alert('Error: ' + res.message);
            }
        } catch (err) {
            console.error('Submission failed', err);
            alert('Failed to save report.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="smw-container">
            <header className="smw-header">
                <button className="smw-back-btn" onClick={() => navigate(`/doctor/patients/${id}`)}>
                    <ChevronLeft size={20} />
                </button>
                <h1>6 Min Walk Test</h1>
                <div style={{ width: 40 }} />
            </header>

            <div className="smw-content">
                <motion.section
                    className="smw-hero"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="smw-hero-icon">
                        <Activity size={40} />
                    </div>
                    <h2>Test Description</h2>
                    <p>Record observations and distance for Patient: {id}</p>
                </motion.section>

                <section className="smw-section">
                    <div className="smw-card">
                        <div className="smw-card-header">
                            <FileText size={16} />
                            <span>Report Details</span>
                        </div>
                        <textarea
                            className="smw-editor"
                            placeholder="Please enter the test results and observations..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </section>

                <button
                    className="smw-submit-btn btn-press"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={20} className="spinner" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            <span>Save Report</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default SixMinWalkTest;
