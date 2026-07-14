import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BellOff, ChevronLeft, Check, X, Calendar } from 'lucide-react';
import { apiCall } from '../../api/apiService';
import './Notifications.css';

interface Appointment {
    id: string;
    patientId: string;
    name: string;
    age: number;
    gender: string;
    symptoms: string;
    phone: string;
    status: string;
    preferred_date: string;
    preferred_time: string;
}

const DoctorNotifications: React.FC = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await apiCall('fetch_appointments.php', 'GET', {});
            if (res && res.appointments) {
                // Filter only pending
                const pending = res.appointments
                    .filter((a: any) => a.status?.toLowerCase() === 'pending')
                    .map((a: any) => ({
                        id: a.appointment_id,
                        patientId: a.patient_id,
                        name: a.name || 'Unnamed',
                        age: parseInt(a.age) || 0,
                        gender: a.gender || 'Other',
                        symptoms: a.symptoms || '',
                        phone: a.contact || '',
                        status: a.status,
                        preferred_date: a.preferred_date || '',
                        preferred_time: a.preferred_time || ''
                    }));
                setAppointments(pending);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            const res = await apiCall('update_appointment_status.php', 'POST', {
                appointment_id: id,
                status: status
            });
            if (res.status === 'success') {
                setAppointments(prev => prev.filter(a => a.id !== id));
                setMessage(status === 'Accepted' ? 'Request accepted successfully!' : 'Request rejected.');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const filtered = appointments.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.symptoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.phone.includes(searchTerm)
    );

    return (
        <div className="notifications-ios-wrapper">
            {message && <div className="ios-toast">{message}</div>}

            <header className="notifications-ios-header">
                <button className="ios-back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} />
                </button>
                <h1>Notifications</h1>
                <div className="header-spacer"></div>
            </header>

            <div className="search-container-ios">
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="notifications-list">
                {loading ? (
                    <div className="loading-state">
                        <div className="ios-spinner"></div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <BellOff size={40} />
                        </div>
                        <p>{searchTerm ? 'No results found' : 'No new notifications'}</p>
                    </div>
                ) : (
                    filtered.map((item, index) => (
                        <div className="notification-card-ios" key={item.id} style={{ animationDelay: `${index * 0.05}s` }}>
                            <div className="card-top">
                                <div className="patient-avatar">
                                    <span>{item.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                                </div>
                                <div className="patient-main-info">
                                    <h3>{item.name}</h3>
                                    <p>Age: {item.age} • {item.gender} • {item.phone}</p>
                                </div>
                            </div>

                            {item.symptoms && (
                                <div className="symptoms-box">
                                    <span className="symptom-label">Symptoms:</span>
                                    <p>{item.symptoms}</p>
                                </div>
                            )}

                            <div className="appointment-meta">
                                <div className="meta-item">
                                    <Calendar size={14} />
                                    <span>{item.preferred_date} • {item.preferred_time}</span>
                                </div>
                            </div>

                            <div className="card-actions-ios">
                                <button className="reject-btn" onClick={() => handleStatusUpdate(item.id, 'Rejected')}>
                                    <X size={18} />
                                    Reject
                                </button>
                                <button className="accept-btn" onClick={() => handleStatusUpdate(item.id, 'Accepted')}>
                                    <Check size={18} />
                                    Accept
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DoctorNotifications;
