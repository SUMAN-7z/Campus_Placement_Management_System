import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protect routes from unauthenticated users
export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// Protect routes by checking specific roles
export const RoleRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role;
  const isAllowed = allowedRoles.includes(role);

  if (!isAllowed) {
    // Redirect to default dashboard depending on user's active role
    if (role === 'ROLE_STUDENT') {
      return <Navigate to="/student/dashboard" replace />;
    } else if (role === 'ROLE_RECRUITER') {
      return <Navigate to="/recruiter/dashboard" replace />;
    } else if (role === 'ROLE_OFFICER' || role === 'ROLE_ADMIN') {
      return <Navigate to="/officer/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
