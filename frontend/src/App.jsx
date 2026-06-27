import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, RoleRoute } from './routes/ProtectedRoutes';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import StudentJobs from './pages/StudentJobs';
import StudentApplications from './pages/StudentApplications';
import StudentInterviews from './pages/StudentInterviews';
import StudentNotifications from './pages/StudentNotifications';

// Recruiter Pages
import RecruiterDashboard from './pages/RecruiterDashboard';
import RecruiterProfile from './pages/RecruiterProfile';
import RecruiterPostJob from './pages/RecruiterPostJob';
import RecruiterApplicants from './pages/RecruiterApplicants';
import RecruiterInterviews from './pages/RecruiterInterviews';

// Officer / Admin Pages
import OfficerDashboard from './pages/OfficerDashboard';
import OfficerStudents from './pages/OfficerStudents';
import OfficerCompanies from './pages/OfficerCompanies';
import OfficerDrives from './pages/OfficerDrives';
import OfficerApplications from './pages/OfficerApplications';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              
              {/* Student Portal */}
              <Route element={<RoleRoute allowedRoles={['ROLE_STUDENT']} />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/profile" element={<StudentProfile />} />
                <Route path="/student/jobs" element={<StudentJobs />} />
                <Route path="/student/applications" element={<StudentApplications />} />
                <Route path="/student/interviews" element={<StudentInterviews />} />
                <Route path="/student/notifications" element={<StudentNotifications />} />
              </Route>

              {/* Recruiter Portal */}
              <Route element={<RoleRoute allowedRoles={['ROLE_RECRUITER']} />}>
                <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
                <Route path="/recruiter/profile" element={<RecruiterProfile />} />
                <Route path="/recruiter/post-job" element={<RecruiterPostJob />} />
                <Route path="/recruiter/applicants" element={<RecruiterApplicants />} />
                <Route path="/recruiter/interviews" element={<RecruiterInterviews />} />
              </Route>

              {/* Placement Officer & Admin Portal */}
              <Route element={<RoleRoute allowedRoles={['ROLE_OFFICER', 'ROLE_ADMIN']} />}>
                <Route path="/officer/dashboard" element={<OfficerDashboard />} />
                <Route path="/officer/students" element={<OfficerStudents />} />
                <Route path="/officer/companies" element={<OfficerCompanies />} />
                <Route path="/officer/drives" element={<OfficerDrives />} />
                <Route path="/officer/applications" element={<OfficerApplications />} />
              </Route>

            </Route>
          </Route>

          {/* Catch all / fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
