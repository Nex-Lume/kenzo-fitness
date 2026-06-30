import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-orange-500">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-800 border-t-orange-500"></div>
        <span className="ml-3 font-semibold tracking-wide">Loading KenzoFitness...</span>
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role isn't authorized for this route
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to respective dashboard if they try to access unauthorized pages
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
