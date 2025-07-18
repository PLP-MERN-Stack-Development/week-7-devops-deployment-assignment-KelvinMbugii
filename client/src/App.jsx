import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import AdminDashboard from "./components/AdminDashboard";
import DoctorPortal from "./components/DoctorPortal";
import PatientPortal from "./components/PatientPortal";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/*"
                element={
                  <ProtectedRoute role="doctor">
                    <DoctorPortal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/*"
                element={
                  <ProtectedRoute role="patient">
                    <PatientPortal />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default App;
