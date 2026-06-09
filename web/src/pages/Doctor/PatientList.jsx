import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Search, User, ChevronRight, Activity, Calendar } from 'lucide-react';
import { BTBackButton, BTCard } from '../../components/BTComponents';
import APIConfig from '../../config';

const PatientList = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await fetch(APIConfig.getURL('fetch_appointments.php'));
            const data = await response.json();
            if (data.status === 'success') {
                // Extract unique patients from appointments
                const uniqueMap = new Map();
                data.appointments.forEach(app => {
                    if (!uniqueMap.has(app.patient_id)) {
                        uniqueMap.set(app.patient_id, {
                            id: app.patient_id,
                            name: app.name,
                            age: app.age,
                            diagnosis: app.duration_symptoms || 'Regular Checkup'
                        });
                    }
                });
                setPatients(Array.from(uniqueMap.values()).sort((a, b) => a.name.localeCompare(b.name)));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchText.toLowerCase()) ||
        p.id.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="page-container flex flex-col pb-12 bg-bt-background">
            <div className="page-header justify-between bg-white/80 backdrop-blur-md border-b border-bt-border">
                <BTBackButton onClick={() => navigate('/doctor')} />
                <h1 className="page-title text-bt-doctor-primary">Patient Directory</h1>
                <div className="w-11" />
            </div>

            <div className="px-6 py-4 bg-white/80 backdrop-blur-md sticky top-[65px] z-10 border-b border-bt-border">
                <div className="bt-input-wrapper bg-bt-background">
                    <Search size={18} className="text-bt-text-tertiary" />
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                    />
                </div>
            </div>

            <div className="page-content pt-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20 gap-4">
                        <div className="w-10 h-10 border-4 border-bt-doctor-primary border-t-transparent rounded-full animate-spin" />
                        <p className="bt-caption text-bt-text-tertiary">Loading registry...</p>
                    </div>
                ) : filteredPatients.length === 0 ? (
                    <div className="text-center p-12 text-bt-text-tertiary">
                        <Users size={64} className="mx-auto mb-4 opacity-20" />
                        <p className="bt-body">No patients found matches your search.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <p className="bt-caption2 text-bt-text-tertiary px-2">{filteredPatients.length} IDENTIFIED PATIENTS</p>
                        {filteredPatients.map((patient, idx) => (
                            <motion.div
                                key={patient.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <BTCard
                                    className="p-5 flex items-center justify-between border border-bt-border hover:border-bt-doctor-primary/40"
                                    onClick={() => navigate('/doctor/reports', { state: { patientId: patient.id } })}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-bt-doctor-gradient flex items-center justify-center text-white bt-headline shadow-lg">
                                            {patient.name[0]}
                                        </div>
                                        <div>
                                            <h3 className="bt-headline">{patient.name}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <div className="flex items-center gap-1 text-bt-text-second bt-caption">
                                                    <Activity size={12} />
                                                    <span>{patient.age}y</span>
                                                </div>
                                                <div className="w-1 h-1 rounded-full bg-bt-text-tertiary" />
                                                <span className="bt-caption text-bt-text-tertiary">{patient.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-bt-text-tertiary" />
                                </BTCard>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientList;
