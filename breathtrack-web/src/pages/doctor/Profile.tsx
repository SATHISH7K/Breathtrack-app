import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Briefcase, ShieldCheck, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiCall } from '../../api/apiService';
import './Profile.css';

const DoctorProfile: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) return;
            try {
                const response = await apiCall('get_doctor_profile.php', 'POST', {
                    doctor_id: user.id
                });
                if (response.status === 'success') {
                    setProfileData(response.data);
                }
            } catch (error) {
                console.error('Error fetching doctor profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    if (loading) {
        return (
            <div className="profile-loading-ios">
                <div className="ios-spinner"></div>
            </div>
        );
    }

    const doctorName = profileData?.name?.startsWith('Dr.') ? profileData.name : `Dr. ${profileData?.name || 'Medical Consultant'}`;

    return (
        <div className="profile-ios-wrapper">
            <header className="profile-ios-header">
                <button className="ios-back-btn" onClick={() => navigate('/doctor/dashboard')}>
                    <ChevronLeft size={24} />
                </button>
                <h1>My Profile</h1>
                <div className="header-spacer"></div>
            </header>

            <div className="profile-ios-content">
                <div className="profile-avatar-section">
                    <div className="avatar-circle-ios">
                        <User size={50} strokeWidth={1.5} />
                    </div>
                    <span className="doc-type-label">Primary Consultant</span>
                </div>

                <div className="profile-details-list">
                    <ProfileDetailRow
                        icon={<User />}
                        label="Name"
                        value={doctorName}
                    />
                    <ProfileDetailRow
                        icon={<Calendar />}
                        label="Age"
                        value={profileData?.age ? `${profileData.age} years` : '—'}
                    />
                    <ProfileDetailRow
                        icon={<Mail />}
                        label="Email"
                        value={profileData?.email || '—'}
                    />
                    <ProfileDetailRow
                        icon={<Phone />}
                        label="Phone"
                        value={profileData?.phone || '—'}
                    />
                    <ProfileDetailRow
                        icon={<Briefcase />}
                        label="Specialization"
                        value="Pulmonologist"
                    />
                    <ProfileDetailRow
                        icon={<ShieldCheck />}
                        label="Doctor ID"
                        value={user?.id || '—'}
                    />
                </div>
            </div>
        </div>
    );
};

interface RowProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

const ProfileDetailRow: React.FC<RowProps> = ({ icon, label, value }) => (
    <div className="ios-detail-row">
        <div className="row-icon-container">
            {icon}
        </div>
        <div className="row-text-container">
            <span className="row-label">{label}</span>
            <span className="row-value">{value}</span>
        </div>
    </div>
);

export default DoctorProfile;
