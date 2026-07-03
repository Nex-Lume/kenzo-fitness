import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Protection Wrapper
import ProtectedRoute from './routes/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Plans from './pages/Plans';

// Dashboard Protected Pages
import MemberDashboard from './pages/MemberDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminMembers from './pages/AdminMembers';

import Contact from './pages/Contact';
import AdminContactMessages from './pages/AdminContactMessages';
import MemberProfile from './pages/MemberProfile';
import AdminPlans from './pages/AdminPlans';
import BookSlot from './pages/BookSlot';
import Attendance from './pages/Attendance';
import PeakTime from './pages/PeakTime';
import AdminSlots from './pages/AdminSlots';
import AdminAttendance from './pages/AdminAttendance';
import AdminReports from './pages/AdminReports';
import ReceptionDashboard from './pages/ReceptionDashboard';
import AdminTrainers from './pages/AdminTrainers';
import AdminPayments from './pages/AdminPayments';
import TrainerDashboard from './pages/TrainerDashboard';
import TrainerMembers from './pages/TrainerMembers';
import TrainerWorkouts from './pages/TrainerWorkouts';
import TrainerDiets from './pages/TrainerDiets';
import TrainerProgress from './pages/TrainerProgress';
import TrainerGoals from './pages/TrainerGoals';
import MemberWorkouts from './pages/MemberWorkouts';
import MemberDiets from './pages/MemberDiets';
import MemberProgress from './pages/MemberProgress';
import MemberGoals from './pages/MemberGoals';
import MemberCheckout from './pages/MemberCheckout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import Invoice from './pages/Invoice';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<Home />} />
          <Route element={<MainLayout />}>
            <Route path="plans" element={<Plans />} />
            <Route path="admission" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="contact" element={<Contact />} />
            <Route path="peak-time" element={<PeakTime />} />
          </Route>

          {/* Member Dashboard Routes (Protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['member']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MemberDashboard />} />
            <Route path="profile" element={<MemberProfile />} />
            <Route path="book-slot" element={<BookSlot />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="workouts" element={<MemberWorkouts />} />
            <Route path="diets" element={<MemberDiets />} />
            <Route path="progress" element={<MemberProgress />} />
            <Route path="goals" element={<MemberGoals />} />
            <Route path="checkout" element={<MemberCheckout />} />
            <Route path="payment-success" element={<PaymentSuccess />} />
            <Route path="payment-failed" element={<PaymentFailed />} />
            <Route path="invoice" element={<Invoice />} />
          </Route>

          {/* Admin Dashboard Routes (Protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="messages" element={<AdminContactMessages />} />
            <Route path="slots" element={<AdminSlots />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="trainers" element={<AdminTrainers />} />
            <Route path="payments" element={<AdminPayments />} />
          </Route>

          {/* Reception Dashboard Routes (Protected) */}
          <Route
            path="/reception"
            element={
              <ProtectedRoute allowedRoles={['reception', 'admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="scan" element={<ReceptionDashboard />} />
          </Route>

          {/* Trainer Dashboard Routes (Protected) */}
          <Route
            path="/trainer"
            element={
              <ProtectedRoute allowedRoles={['trainer']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TrainerDashboard />} />
            <Route path="members" element={<TrainerMembers />} />
            <Route path="workout-plans" element={<TrainerWorkouts />} />
            <Route path="diet-plans" element={<TrainerDiets />} />
            <Route path="progress" element={<TrainerProgress />} />
            <Route path="goals" element={<TrainerGoals />} />
          </Route>

          {/* Fallback routing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
