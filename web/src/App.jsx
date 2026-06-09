import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import APIConfig from './config';
import { AuthProvider, useAuth } from './context/AuthContext';

// ─── PAGES ────────────────────────────────────────────────
import Intro from './pages/Intro/Intro';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import RecoverID from './pages/Auth/RecoverID';
import PatientDashboard from './pages/Patient/Dashboard';
import DoctorDashboard from './pages/Doctor/Dashboard';
import PatientSignup from './pages/Auth/PatientSignup';
import Checkup from './pages/Patient/Checkup';
import OxygenCheck from './pages/Patient/OxygenCheck';
import LungCheck from './pages/Patient/LungCheck';
import Questionnaires from './pages/Patient/Questionnaires';
import Appointments from './pages/Patient/Appointments';
import Reminders from './pages/Patient/Reminders';
import Profile from './pages/Patient/Profile';
import Vaccination from './pages/Patient/Vaccination';
import FinalAdvice from './pages/Patient/FinalAdvice';
import MedicationDiary from './pages/Patient/MedicationDiary';
import Resources from './pages/Patient/Resources';
import CopdReview from './pages/Patient/CopdReview';
import Analysis from './pages/Patient/Analysis';

// Doctor pages
import PatientList from './pages/Doctor/PatientList';
import PatientReports from './pages/Doctor/PatientReports';
import SubmitReport from './pages/Doctor/SubmitReport';
import ManageVideos from './pages/Doctor/ManageVideos';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';

// ─── PROTECTED ROUTE ───────────────────────────────────────
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === 'patient' ? '/patient' : '/doctor'} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: 'var(--bt-background)' }}>
        <div style={{ width: '100%', maxWidth: '480px', background: 'var(--bt-background)', minHeight: '100vh', display: 'flex', flexDirection: 'column', boxShadow: '0 0 60px rgba(0,0,0,0.08)' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Intro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<PatientSignup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/recover-id" element={<RecoverID />} />

            {/* Patient Routes */}
            <Route path="/patient" element={
              <ProtectedRoute allowedRole="patient">
                <PatientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/patient/checkup" element={<Checkup />} />
            <Route path="/patient/oxygen" element={<OxygenCheck />} />
            <Route path="/patient/lung" element={<LungCheck />} />
            <Route path="/patient/questionnaires" element={<Questionnaires />} />
            <Route path="/patient/appointments" element={<Appointments />} />
            <Route path="/patient/reminders" element={<Reminders />} />
            <Route path="/patient/profile" element={<Profile />} />
            <Route path="/patient/vaccination" element={<Vaccination />} />
            <Route path="/patient/advice" element={<FinalAdvice />} />
            <Route path="/patient/medication" element={<MedicationDiary />} />
            <Route path="/patient/resources" element={<Resources />} />
            <Route path="/patient/review" element={<CopdReview />} />
            <Route path="/patient/analysis" element={<Analysis />} />

            {/* Doctor Routes */}
            <Route path="/doctor" element={
              <ProtectedRoute allowedRole="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/doctor/patients" element={<PatientList />} />
            <Route path="/doctor/reports" element={<PatientReports />} />
            <Route path="/doctor/submit-report" element={<SubmitReport />} />
            <Route path="/doctor/videos" element={<ManageVideos />} />
            <Route path="/doctor/profile" element={<DoctorProfile />} />
            <Route path="/doctor/appointments" element={<DoctorAppointments />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
