import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Check, CheckCircle2, Loader2,
    Save, Pill
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiCall } from '../../api/apiService';
import './Medication.css';

interface Medicine {
    id: string;
    name: string;
    isSelected: boolean;
}

const Medication: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [medicines, setMedicines] = useState<Medicine[]>([
        { id: '1', name: "MDI Glycohale FB (LABA + LAMA + ICS) - Formoterol fumarate 6 mcg, Glycopyrronium 12.5 mcg and budesonide 200 mcg", isSelected: false },
        { id: '2', name: "MDI Budamate (LABA + ICS) - Formoterol fumarate 6 mcg and budesonide 200/400 mcg", isSelected: false },
        { id: '3', name: "MDI Duolin (SABA + SAMA) - Levosalbutamol 50 mcg and ipratropium bromide 20 mcg", isSelected: false },
        { id: '4', name: "MDI Trimium (LABA + LAMA + ICS) - Formoterol fumarate 6 mcg, tiotropium bromide 9 mcg and cyclosonide 200 mcg", isSelected: false },
        { id: '5', name: "MDI Tiova (LAMA) - Tiotropium bromide 9 mcg", isSelected: false },
        { id: '6', name: "MDI Forglyn (LABA + LAMA) - Formoterol fumarate 4.8 mcg and glycopyrrolate 9 mcg", isSelected: false }
    ]);

    const [remarks, setRemarks] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleMedicine = (medId: string) => {
        setMedicines(prev => prev.map(m =>
            m.id === medId ? { ...m, isSelected: !m.isSelected } : m
        ));
    };

    const handleSubmit = async () => {
        const selectedMeds = medicines.filter(m => m.isSelected).map(m => m.name);
        if (selectedMeds.length === 0 && !remarks.trim()) {
            alert('Please select at least one medicine or enter remarks.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await apiCall('save_medication_diary.php', 'POST', {
                patient_id: id,
                medicines: selectedMeds,
                remarks: remarks
            });

            if (res.status === 'success') {
                alert('Medication Plan Saved Successfully!');
                navigate(`/doctor/patients/${id}`);
            } else {
                alert('Error: ' + res.message);
            }
        } catch (err) {
            console.error('Submission failed', err);
            alert('Failed to save medication plan.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="med-container">
            <header className="med-header">
                <button className="med-back-btn" onClick={() => navigate(`/doctor/patients/${id}`)}>
                    <ChevronLeft size={20} />
                </button>
                <h1>Medication Diary</h1>
                <div style={{ width: 40 }} />
            </header>

            <div className="med-content">
                <section className="med-intro">
                    <div className="med-intro-icon">
                        <Pill size={32} />
                    </div>
                    <h2>Prescribe Medications</h2>
                    <p>Select the appropriate medications and add physician remarks for the patient.</p>
                </section>

                <section className="med-section">
                    <h3 className="section-title">Available Prescriptions</h3>
                    <div className="med-list">
                        <AnimatePresence>
                            {medicines.map((med, idx) => (
                                <motion.div
                                    key={med.id}
                                    className={`med-item ${med.isSelected ? 'selected' : ''}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => toggleMedicine(med.id)}
                                >
                                    <div className="med-checkbox">
                                        {med.isSelected && <Check size={14} strokeWidth={3} />}
                                    </div>
                                    <span className="med-name">{med.name}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>

                <section className="med-section">
                    <h3 className="section-title">Physician Remarks</h3>
                    <textarea
                        className="med-remarks"
                        placeholder="Enter dosage instructions or clinical notes..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                    />
                </section>

                <button
                    className="med-submit-btn btn-press"
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
                            <Save size={20} />
                            <span>Save Medication Plan</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Medication;
