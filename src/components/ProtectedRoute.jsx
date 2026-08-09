import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('auth_token');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedRoute;
